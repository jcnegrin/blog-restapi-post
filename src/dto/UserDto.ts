import { RoleDto } from "./RoleDto";

export class UserDto {
    id: string;
    email: string;
    user_id: string;
    enabled: boolean;
    first_name: string;
    last_name: string;
    createdAt: Date;
    updatedAt: Date;
    role: RoleDto;
}