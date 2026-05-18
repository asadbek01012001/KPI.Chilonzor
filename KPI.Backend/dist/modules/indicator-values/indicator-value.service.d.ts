import { CreateIndicatorValueDtoType, UpdateIndicatorValueDtoType, IndicatorValuePaginationDtoType } from './indicator-value.dto';
export declare const indicatorValueService: {
    getAll: (q: IndicatorValuePaginationDtoType) => Promise<{
        rows: import("./indicator-value.entity").IndicatorValue[];
        total: number;
    }>;
    getById: (id: string) => Promise<import("./indicator-value.entity").IndicatorValue>;
    create: (dto: CreateIndicatorValueDtoType) => Promise<import("./indicator-value.entity").IndicatorValue>;
    update: (id: string, dto: UpdateIndicatorValueDtoType) => Promise<import("./indicator-value.entity").IndicatorValue>;
    delete: (id: string) => Promise<void>;
    bulkCreate: (dto: any) => Promise<{
        inserted: number;
    }>;
    deleteByDate: (date: string) => Promise<{
        deleted: number;
        date: string;
    }>;
};
//# sourceMappingURL=indicator-value.service.d.ts.map