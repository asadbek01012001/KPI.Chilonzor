import { CreateEmergency102DtoType, UpdateEmergency102DtoType, Emergency102PaginationDtoType } from './emergency102.dto';
export declare const emergency102Service: {
    getAll: (q: Emergency102PaginationDtoType) => Promise<{
        rows: any[];
        total: number;
        totals: any;
    }>;
    getById: (id: string) => Promise<import("./emergency102.entity").Emergency102>;
    create: (dto: CreateEmergency102DtoType) => Promise<import("./emergency102.entity").Emergency102>;
    update: (id: string, dto: UpdateEmergency102DtoType) => Promise<import("./emergency102.entity").Emergency102>;
    delete: (id: string) => Promise<void>;
    bulkCreate: (dto: any) => Promise<{
        inserted: number;
    }>;
};
//# sourceMappingURL=emergency102.service.d.ts.map