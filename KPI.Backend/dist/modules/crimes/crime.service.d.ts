import { CreateCrimeDtoType, UpdateCrimeDtoType, CrimePaginationDtoType } from "./crime.dto";
export declare const crimeService: {
    getAll: (q: CrimePaginationDtoType) => Promise<any>;
    getById: (id: string) => Promise<import("./crime.entity").Crime>;
    create: (dto: CreateCrimeDtoType) => Promise<import("./crime.entity").Crime>;
    update: (id: string, dto: UpdateCrimeDtoType) => Promise<import("./crime.entity").Crime>;
    delete: (id: string) => Promise<void>;
    bulkCreate: (dto: any) => Promise<{
        inserted: number;
    }>;
};
//# sourceMappingURL=crime.service.d.ts.map