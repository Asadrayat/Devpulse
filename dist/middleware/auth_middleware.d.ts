import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../modules/types";
declare const auth: (...roles: ROLES[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth_middleware.d.ts.map