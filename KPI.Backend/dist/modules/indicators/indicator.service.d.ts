import { CreateIndicatorDtoType, UpdateIndicatorDtoType, IndicatorPaginationDtoType } from './indicator.dto';
export declare const indicatorService: {
    getAll: (q: IndicatorPaginationDtoType) => Promise<{
        rows: (import("./indicator.entity").Indicator & {
            children: import("./indicator.entity").Indicator[];
        })[];
        total: number;
    }>;
    getFlatList: (directionId: string) => Promise<import("./indicator.entity").Indicator[]>;
    getById: (id: string) => Promise<import("./indicator.entity").Indicator>;
    create: (dto: CreateIndicatorDtoType) => Promise<import("./indicator.entity").Indicator>;
    update: (id: string, dto: UpdateIndicatorDtoType) => Promise<import("./indicator.entity").Indicator>;
    delete: (id: string) => Promise<void>;
};
//# sourceMappingURL=indicator.service.d.ts.map