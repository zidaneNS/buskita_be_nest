import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestWithUser } from 'src/app.contract';
import { Role } from 'src/models/roles.model';
import { ROLE } from 'src/roles/roles.decorator';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(
    @InjectModel(Role)
    private roleRepositories: typeof Role
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest<RequestWithUser>();

    const { roleId, userId } = user;

    try {
      const foundRole = await this.roleRepositories.findOne({ where: { roleId }});
  
      if (!foundRole) throw new NotFoundException();

      const userRole: Role = foundRole.get();
      
      if (userRole.name === ROLE.SuperAdmin) return true;

      return params.userId === userId;
    } catch (err) {
      console.error(err);

      return false;
    }
  }
}
