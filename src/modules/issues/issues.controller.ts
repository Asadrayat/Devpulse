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

        const issues = await issueService.getAllIssuesFromDb({ sort, type, status });

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

export const issueController = {
  createIssue,
  getAllIssue,
};
