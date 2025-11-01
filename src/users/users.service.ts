import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse } from './users.contract';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import responseTemplate from 'src/helpers/responseTemplate';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepositories: typeof User
  ) {}

  async findAll(): Promise<DefaultResponse<FindAllUsersResponse>> {
    const data = await this.userRepositories.findAll({
      attributes: { exclude: ['password'] }
    });

    return responseTemplate(HttpStatus.OK, 'find all users', {
      data
    })
  }

  async findOne(userId: string): Promise<DefaultResponse<FindOneUserResponse>> {
    const findUser = await this.userRepositories.findOne({
      where: {
        userId
      },
      attributes: { exclude: ['password'] }
    });

    if (findUser) return responseTemplate(HttpStatus.OK, 'find one user', {
      data: findUser
    })

    throw new HttpException('user not found', HttpStatus.NOT_FOUND)
  }
}
