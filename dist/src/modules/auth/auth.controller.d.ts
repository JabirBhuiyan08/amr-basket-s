import { Request, Response } from 'express';
export declare const authController: {
    googleAuth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    me: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=auth.controller.d.ts.map