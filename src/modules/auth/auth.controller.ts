import type { Request, Response } from "express";
import { authService } from "./auth.service";


    const loginUser = async (req: Request, res: Response) => {
        try {
            const result = await authService.loginUserIntoDB(req.body);

            const { refreshToken } = result;

            res.cookie("refreshToken", refreshToken, {
                secure: false, //In production true
                httpOnly: true, // we can access when Inproduction true
                sameSite: 'lax'
            })
            console.log(result);

            res.status(201).json({
                success: true,
                message: "User Loggedin Successfully",
                data: result
            })
            } catch (error: any) {
            res.status(500).json({
                messge: error,
                error: error.message,
            });
        }
    }

    const refreshToken = async (req: Request, res: Response) => {
        try {
            const result = await authService.generateRefrshToken(
                req.cookies.refreshToken,
            );


            res.status(201).json({
                success: true,
                message: "Access Token Generated",
                data: result
            })
        } catch (error: any) {
            res.status(500).json({
                messge: error,
                error: error.message,
            });
        }
    }

export const authController = {
    loginUser,
    refreshToken
}