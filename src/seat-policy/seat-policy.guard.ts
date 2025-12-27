import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ACTION, ACTION_KEY } from 'src/actions/actions.decorator';
import { Role } from 'src/models/roles.model';
import { Seat } from 'src/models/seats.model';
import { User } from 'src/models/users.model';
import { ROLE } from 'src/roles/roles.decorator';

@Injectable()
export class SeatPolicyGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @InjectModel(User)
    private userRepositories: typeof User,

    @InjectModel(Seat)
    private seatRepositories: typeof Seat,

    @InjectModel(Role)
    private roleRepositories: typeof Role,

    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const requiredActions = this.reflector.getAllAndOverride<ACTION[]>(ACTION_KEY, [
        context.getClass(),
        context.getHandler()
      ]);

      const req = context.switchToHttp().getRequest() as Request;
      const [_, token] = req.headers.authorization?.split(' ') ?? [];
      const seatId = req.params.seatId
  
      if (!token) throw new UnauthorizedException();
      if (!seatId) throw new BadRequestException('seatId undefined');
  
      const user = this.jwtService.decode(token) as User;
      const foundUser = await this.userRepositories.findByPk(user.userId);
      const foundRole = await this.roleRepositories.findByPk(user.roleId);

      if (!foundRole) throw new NotFoundException(`role with id ${user.roleId} not found`);
      if (!foundUser) throw new NotFoundException(`user not with id ${user.userId} not found`);

      const role = foundRole.get() as Role;
  
      const foundSeat = await this.seatRepositories.findByPk(seatId);
      if (!foundSeat) throw new NotFoundException(`seat with id ${seatId} not found`);
      const seat = foundSeat.get() as Seat;
      
      if (requiredActions.some(action => action === ACTION.Update || action === ACTION.Delete)) {
        return seat.userId === user.userId || role.name !== ROLE.User;
      }
      
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
