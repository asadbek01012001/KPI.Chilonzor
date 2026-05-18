import { Indicator } from "./indicator.entity";
import { CreateIndicatorDtoType, UpdateIndicatorDtoType, IndicatorPaginationDtoType } from "./indicator.dto";
export declare const indicatorRepository: {
    findAll: (q: IndicatorPaginationDtoType) => Promise<{
        rows: (Indicator & {
            children: Indicator[];
        })[];
        total: number;
    }>;
    getFlatList: (directionId: string) => Promise<Indicator[]>;
    findById: (id: string) => Promise<Indicator | null>;
    create: (dto: CreateIndicatorDtoType) => Promise<Indicator>;
    update: (id: string, dto: UpdateIndicatorDtoType) => Promise<Indicator | null>;
    delete: (id: string) => Promise<boolean>;
};
//# sourceMappingURL=indicator.repository.d.ts.map