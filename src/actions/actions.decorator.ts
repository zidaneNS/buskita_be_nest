import { SetMetadata } from '@nestjs/common';

export enum ACTION {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export const ACTION_KEY = 'actions'
export const Actions = (...actions: ACTION[]) => SetMetadata(ACTION_KEY, actions);
