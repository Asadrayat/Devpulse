
import express, {
    type Application,
    type Request,
    type Response,
} from "express";

import { userRoute } from "./modules/user/user.route";

import { authRoute } from "./modules/auth/auth.route";
// import logger from "./middleware/logger";
// import CookieParser from "cookie-parser";
import cors from "cors";
// import cors from "cors";
// import globalErrorHandler from "./middleware/globalErrorHandler";
import { issueRoute } from "./modules/issues/issues.route";

const app: Application = express();

// app.use(CookieParser()); // to refresh token to the controller
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
// app.use(logger);

const corsOption = {
    origin: "http://localhost:8000/",    
}

app.use(cors(corsOption))

app.get("/", (req: Request, res: Response) => {
    // res.send('Hello World User!');
    res.status(200).json({
        message: "Devpulse Server",
        author: "Devpulse",
    });
});

app.use("/api/auth", userRoute); // /api/auth/signup route will create user
app.use("/api/issues", issueRoute);
app.use("/api/auth", authRoute);

// app.use(globalErrorHandler);


export default app;