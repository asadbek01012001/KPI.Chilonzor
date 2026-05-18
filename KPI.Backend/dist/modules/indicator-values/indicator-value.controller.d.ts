import { Request, Response, NextFunction } from 'express';
export declare const indicatorValueController: {
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bulkCreate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteByDate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=indicator-value.controller.d.ts.map