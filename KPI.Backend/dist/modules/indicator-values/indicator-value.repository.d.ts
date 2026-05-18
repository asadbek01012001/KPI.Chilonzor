import { IndicatorValue } from './indicator-value.entity';
import { CreateIndicatorValueDtoType, UpdateIndicatorValueDtoType, IndicatorValuePaginationDtoType, BulkCreateIndicatorValueDtoType } from './indicator-value.dto';
export declare const indicatorValueRepository: {
    findAll: (q: IndicatorValuePaginationDtoType) => Promise<{
        rows: IndicatorValue[];
        total: number;
    }>;
    findById: (id: string) => Promise<IndicatorValue | null>;
    create: (dto: CreateIndicatorValueDtoType) => Promise<IndicatorValue>;
    update: (id: string, dto: UpdateIndicatorValueDtoType) => Promise<IndicatorValue | null>;
    delete: (id: string) => Promise<boolean>;
    deleteByDate: (date: string) => Promise<number>;
    bulkCreate: (dto: BulkCreateIndicatorValueDtoType) => Promise<{
        inserted: number;
    }>;
};
//# sourceMappingURL=indicator-value.repository.d.ts.map