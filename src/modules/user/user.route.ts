import { Router } from "express";
import { userController } from "./user.controller";
// import { profileController } from "./profile.controller";

const router = Router();

router.post("/signup", userController.createUser);

export const userRoute = router;