import { Request, Response } from "express";
export declare const settingsController: {
    getAllSettings: (req: Request, res: Response) => Promise<void>;
    getSettingByKey: (req: Request, res: Response) => Promise<void>;
    setSetting: (req: Request, res: Response) => Promise<void>;
    deleteSetting: (req: Request, res: Response) => Promise<void>;
};
export default settingsController;
//# sourceMappingURL=settings.controller.d.ts.map