import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse } from './users.contract';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import responseTemplate from 'src/helpers/responseTemplate';
import { Role } from 'src/models/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepositories: typeof User
  ) {}
  private readonly logger = new Logger('UsersService');

  async findAll(): Promise<DefaultResponse<FindAllUsersResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      const data = await this.userRepositories.findAll({
        attributes: { exclude: ['password'] }
      });
  
      return responseTemplate(HttpStatus.OK, 'find all users', {
        data
      })
    } catch (err) {
      this.logger.error(`findAll:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(userId: string): Promise<DefaultResponse<FindOneUserResponse>> {
    try {
      this.logger.log('---FIND ONE---');
      this.logger.log(`findOne:::params: ${JSON.stringify(userId)}`);

      const findUser = await this.userRepositories.findOne({
        where: {
          userId
        },
        attributes: { exclude: ['password'] },
        include: [Role]
      });
  
      if (findUser) return responseTemplate(HttpStatus.OK, 'find one user', {
        data: findUser
      })
  
      throw new HttpException('user not found', HttpStatus.NOT_FOUND)
    } catch (err) {
      this.logger.error(`findOne:::ERROR: ${JSON.stringify(err)}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
