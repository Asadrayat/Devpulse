// issues.service.ts
import { pool } from "../../db";
import type { IssueFilters } from "./issue.interface";

const createIssueIntoDb = async (payload: {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
    [title, description, type, reporter_id]
  );

  return result;
};

// get all user from database

const getAllIssuesFromDb = async (filters: IssueFilters) => {
  const { sort = "newest", type, status } = filters;

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) conditions.push(`type = $${values.push(type)}`);
  if (status) conditions.push(`status = $${values.push(status)}`);

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = sort === "oldest" ? "ASC" : "DESC";

  const { rows: issues } = await pool.query(
    `SELECT * FROM issues ${where} ORDER BY created_at ${order}`,
    values
  );

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
  const { rows: reporters } = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds]
  );

  const reporterMap = Object.fromEntries(reporters.map((r) => [r.id, r]));

  return issues.map(({ reporter_id, ...issue }) => ({
    ...issue,
    reporter: reporterMap[reporter_id] ?? null,
  }));
};

// const getSingleUserFromDB = async (id: string) => {
//   const result = await pool.query(
//       `
//               SELECT * FROM users WHERE id=$1;
//           `,
//       [id]
//   );
//   return result
// }

const getSingleIssueFromDb = async (id: string) => {
  const issueResult = await pool.query(
      `SELECT * FROM issues WHERE id = $1`,
      [id]
  );

  if (issueResult.rows.length === 0) return null;

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [issue.reporter_id]
  );

  const { reporter_id, ...issueWithoutReporterId } = issue;

  return {
      ...issueWithoutReporterId,
      reporter: reporterResult.rows[0] ?? null,
  };
};

const updateIssueIntoDb = async (
  id: string,
  payload: Partial<{ title: string; description: string; type: "bug" | "feature_request" }>
) => {
  const { title, description, type } = payload;

  const result = await pool.query(
      `UPDATE issues
       SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         type        = COALESCE($3, type),
         updated_at  = NOW()
       WHERE id = $4
       RETURNING *`,
      [title ?? null, description ?? null, type ?? null, id]
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDb,
  getAllIssuesFromDb,
  getSingleIssueFromDb,
  updateIssueIntoDb
};
