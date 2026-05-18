import { Request, Response, NextFunction } from 'express';
export declare const dashboardController: {
    getMahalla: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    topCrimes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    top102: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sectorSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sectorRegions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    directionsWithCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    regionsByDirection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    indicatorsByDirectionAndRegion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    regionSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    chartRegion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    chartDirection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    chartDistrict: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=dashboard.controller.d.ts.map