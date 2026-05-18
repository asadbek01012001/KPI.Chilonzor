import { UserResponse } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { PaginationMeta } from '../../utils/response';
export declare const userService: {
    getAll: (page: number, limit: number, search?: string) => Promise<{
        data: UserResponse[];
        meta: PaginationMeta;
    }>;
    getById: (id: string) => Promise<UserResponse>;
    create: (dto: CreateUserDto) => Promise<UserResponse>;
    update: (id: string, dto: UpdateUserDto, requesterId: string, requesterRole: string) => Promise<UserResponse>;
    delete: (id: string, requesterId: string, requesterRole: string) => Promise<void>;
};
//# sourceMappingURL=user.service.d.ts.map