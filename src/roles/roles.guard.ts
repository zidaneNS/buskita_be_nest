import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE, ROLES_KEY } from './roles.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/models/roles.model';
import { RequestWithUser } from 'src/app.contract';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(Role)
    private roleRepositories: typeof Role,

    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    const { roleId } = user;

    try {
      const foundRole = await this.roleRepositories.findOne({ where: { roleId }});
  
      if (!foundRole) throw new NotFoundException('role not found');
  
      const userRole: Role = foundRole.get();
  
      return requiredRoles.some(role => userRole.name === role);
    } catch (err) {
      console.error(err);

      return false;
    }
  }
}
