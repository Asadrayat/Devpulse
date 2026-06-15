import express, {} from "express";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import cors from "cors";
import { issueRoute } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
const corsOption = {
    origin: "http://localhost:8000/",
};
app.use(cors(corsOption));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Devpulse Server",
        author: "Devpulse",
    });
});
app.use("/api/auth", userRoute);
app.use("/api/issues", issueRoute);
app.use(globalErrorHandler);
app.use("/api/auth", authRoute);
export default app;
//# sourceMappingURL=app.js.map