import { Request, Response } from "express";
export declare const helpController: {
    createPublicHelpRequest: (req: Request, res: Response) => Promise<void>;
    createHelpRequest: (req: Request, res: Response) => Promise<void>;
    getAllHelpRequests: (req: Request, res: Response) => Promise<void>;
    getHelpRequestById: (req: Request, res: Response) => Promise<void>;
    updateHelpRequestStatus: (req: Request, res: Response) => Promise<void>;
};
export default helpController;
//# sourceMappingURL=help.controller.d.ts.map