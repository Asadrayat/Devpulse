import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if ((error as any)?.code === "23505") {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "A user with this email already exists",
        data: null,
      })
      return;
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
      data: null,
    })
  }
};

export const userController = {
  createUser,
};
