import { Emergency102 } from './emergency102.entity';
import { CreateEmergency102DtoType, UpdateEmergency102DtoType, Emergency102PaginationDtoType, BulkCreateEmergency102DtoType } from './emergency102.dto';
export declare const emergency102Repository: {
    findAll: (q: Emergency102PaginationDtoType) => Promise<{
        rows: any[];
        total: number;
        totals: any;
    }>;
    findById: (id: string) => Promise<Emergency102 | null>;
    create: (dto: CreateEmergency102DtoType) => Promise<Emergency102>;
    update: (id: string, dto: UpdateEmergency102DtoType) => Promise<Emergency102 | null>;
    delete: (id: string) => Promise<boolean>;
    bulkCreate: (dto: BulkCreateEmergency102DtoType) => Promise<{
        inserted: number;
    }>;
};
//# sourceMappingURL=emergency102.repository.d.ts.map