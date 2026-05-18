import { Region } from './region.entity';
import { CreateRegionDtoType, UpdateRegionDtoType, RegionPaginationDtoType } from './region.dto';
export declare const regionRepository: {
    findAll: (q: RegionPaginationDtoType) => Promise<{
        rows: Region[];
        total: number;
    }>;
    findById: (id: string) => Promise<Region | null>;
    create: (dto: CreateRegionDtoType) => Promise<Region>;
    update: (id: string, dto: UpdateRegionDtoType) => Promise<Region | null>;
    delete: (id: string) => Promise<boolean>;
};
//# sourceMappingURL=region.repository.d.ts.map