import { Request, Response, NextFunction } from "express";
type ErrorWithDetails = Error & {
    code?: string;
    status?: number;
    statusCode?: number;
    meta?: Record<string, unknown>;
    type?: string;
};
declare const errorHandler: (err: ErrorWithDetails, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map