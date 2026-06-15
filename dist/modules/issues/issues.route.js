import { Router } from "express";
import { issueController } from "./issues.controller";
import auth from "../../middleware/auth_middleware";
import { userRole } from "../types";
const router = Router();
router.post("/", auth(userRole.contributor, userRole.maintainer), issueController.createIssue);
router.get("/", issueController.getAllIssue);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", auth(userRole.contributor, userRole.maintainer), issueController.updateIssue);
router.delete("/:id", auth(userRole.maintainer), issueController.deleteIssue);
export const issueRoute = router;
//# sourceMappingURL=issues.route.js.map