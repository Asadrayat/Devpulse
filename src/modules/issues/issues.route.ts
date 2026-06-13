import { Router } from "express";
import { issueController } from "./issues.controller";
import auth from "../../middleware/auth_middleware";
import { userRole } from "../types";

const router = Router();

router.post("/", auth(userRole.contributor, userRole.maintainer), issueController.createIssue);

export const issueRoute = router;