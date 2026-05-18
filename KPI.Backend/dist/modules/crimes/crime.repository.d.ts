import { Crime } from './crime.entity';
import { CreateCrimeDtoType, UpdateCrimeDtoType, CrimePaginationDtoType, BulkCreateCrimeDtoType } from './crime.dto';
export declare const crimeRepository: {
    findAll: (q: CrimePaginationDtoType) => Promise<{
        rows: any[];
        total: number;
        totals: any;
    }>;
    findById: (id: string) => Promise<Crime | null>;
    create: (dto: CreateCrimeDtoType) => Promise<Crime>;
    update: (id: string, dto: UpdateCrimeDtoType) => Promise<Crime | null>;
    delete: (id: string) => Promise<boolean>;
    bulkCreate: (dto: BulkCreateCrimeDtoType) => Promise<{
        inserted: number;
    }>;
};
//# sourceMappingURL=crime.repository.d.ts.map