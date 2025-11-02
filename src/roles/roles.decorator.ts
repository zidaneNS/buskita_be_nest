import { SetMetadata } from '@nestjs/common';

export enum ROLE {
  Admin = 'admin',
  User = 'user',
  SuperAdmin = 'superadmin'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
