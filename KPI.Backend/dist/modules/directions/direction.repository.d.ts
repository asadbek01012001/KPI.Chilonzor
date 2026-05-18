import { Direction } from './direction.entity';
import { CreateDirectionDtoType, UpdateDirectionDtoType, DirectionPaginationDtoType } from './direction.dto';
export declare const directionRepository: {
    findAll: (q: DirectionPaginationDtoType) => Promise<{
        rows: Direction[];
        total: number;
    }>;
    findById: (id: string) => Promise<Direction | null>;
    create: (dto: CreateDirectionDtoType) => Promise<Direction>;
    update: (id: string, dto: UpdateDirectionDtoType) => Promise<Direction | null>;
    delete: (id: string) => Promise<boolean>;
};
//# sourceMappingURL=direction.repository.d.ts.map