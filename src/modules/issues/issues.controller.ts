// issues.controller.ts
import type { Request, Response } from "express";
import { issueService } from "./issues.service";
import { userService } from "../user/user.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = (req as any).user.id;

    const result = await issueService.createIssueIntoDb({
      ...req.body,
      reporter_id,
    });
    console.log(result);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
      errors: null,
    });
  }
};

const getAllIssue = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query as {
      sort?: "newest" | "oldest";
      type?: "bug" | "feature_request";
      status?: "open" | "in_progress" | "resolved";
    };

    const issues = await issueService.getAllIssuesFromDb({
      sort,
      type,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Issues retrived successfully",
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
      errors: null,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new Error("Invalid issue ID");
    }
    const issue = await issueService.getSingleIssueFromDb(id);
    if (!issue) {
      res.status(404).json({
        success: false,
        message: "Issue not found",
        error: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
      errors: null,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new Error("Invalid issue ID");
    }
    const { role, id: userId } = (req as any).user;

    const existingIssue = await issueService.getSingleIssueFromDb(id);

    if (!existingIssue) {
      res.status(404).json({
        success: false,
        message: "Issue not found",
        errors: null,
      });
      return;
    }

    if (role === "contributor") {
      if (existingIssue.reporter?.id !== userId) {
        res.status(403).json({
          success: false,
          message: "Forbidden!! You can only update your own issues",
          errors: null,
        });
        return;
      }

      if (existingIssue.status !== "open") {
        res.status(409).json({
          success: false,
          message: "Conflict!! You can only update issues with status 'open'",
          errors: null,
        });
        return;
      }
    }

    const updatedIssue = await issueService.updateIssueIntoDb(id, req.body);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
      errors: null,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
      const result = await issueService.deleteIssueFromDb(id as string);

      if (result.rowCount === 0) {
          res.status(404).json({
              success: false,
              message: "Issue Not Found",
              data: {},
          });
      }

      res.status(200).json({
          success: true,
          message: "Issue Deleted successfuly",
          data: {},
      });

  } catch (error: any) {
      res.status(500).json({
          messge: error,
          error: error.message,
      });
  }
}

export const issueController = {
  createIssue,
  getAllIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
