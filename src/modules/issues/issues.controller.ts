// issues.controller.ts
import type { Request, Response } from "express";
import { issueService } from "./issues.service";

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

export const issueController = {
    createIssue,
};