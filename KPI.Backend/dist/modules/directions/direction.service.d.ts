import { CreateDirectionDtoType, UpdateDirectionDtoType, DirectionPaginationDtoType } from './direction.dto';
export declare const directionService: {
    getAll: (q: DirectionPaginationDtoType) => Promise<{
        rows: import("./direction.entity").Direction[];
        total: number;
    }>;
    getById: (id: string) => Promise<import("./direction.entity").Direction>;
    create: (dto: CreateDirectionDtoType) => Promise<import("./direction.entity").Direction>;
    update: (id: string, dto: UpdateDirectionDtoType) => Promise<import("./direction.entity").Direction>;
    delete: (id: string) => Promise<void>;
};
//# sourceMappingURL=direction.service.d.ts.map