import { CreateRegionDtoType, UpdateRegionDtoType, RegionPaginationDtoType } from './region.dto';
export declare const regionService: {
    getAll: (q: RegionPaginationDtoType) => Promise<{
        rows: import("./region.entity").Region[];
        total: number;
    }>;
    getById: (id: string) => Promise<import("./region.entity").Region>;
    create: (dto: CreateRegionDtoType) => Promise<import("./region.entity").Region>;
    update: (id: string, dto: UpdateRegionDtoType) => Promise<import("./region.entity").Region>;
    delete: (id: string) => Promise<void>;
};
//# sourceMappingURL=region.service.d.ts.map