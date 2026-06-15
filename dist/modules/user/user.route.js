import { Router } from "express";
import { userController } from "./user.controller";
const router = Router();
router.post("/signup", userController.createUser);
export const userRoute = router;
//# sourceMappingURL=user.route.js.map