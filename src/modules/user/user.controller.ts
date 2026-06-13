import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body)
    // console.log(result);
    
    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: result.rows[0]
    })
    
  } catch (error) {
    if ((error as any)?.code === "23505") {
        res.status(400).json({
          success: false,
          message: "A user with this email already exists",
          data: null,
        });
        return;
      }
    
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    
    
  }
};

export const userController = {
  createUser,
};
