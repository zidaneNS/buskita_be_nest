import { ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DefaultResponse } from 'src/app.contract';
import { FindAllUsersResponse, FindOneUserResponse, UpdateProfileRequest } from './users.contract';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import responseTemplate from 'src/helpers/responseTemplate';
import { Role } from 'src/models/roles.model';
import generateErrMsg from 'src/helpers/generateErrMsg';
import { unlink } from 'node:fs/promises';
import fileIsAvailable from 'src/helpers/fileIsAvailable';
import { InferAttributes } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepositories: typeof User
  ) { }
  private readonly logger = new Logger('UsersService');

  async findAll(): Promise<DefaultResponse<FindAllUsersResponse>> {
    try {
      this.logger.log('---FIND ALL---');

      const data = await this.userRepositories.findAll({
        attributes: { exclude: ['password'] },
        include: [Role]
      });

      const preparedData: InferAttributes<User>[] = data.map(item => {
        const user = item.get();
        this.logger.log(JSON.stringify(user));
        return {
          ...user,
          cardImageUrl: user.cardImageUrl ? `${process.env.APP_URL}/file/${user.cardImageUrl}` : '',
        }
      });

      return responseTemplate(HttpStatus.OK, 'find all users', {
        data: preparedData
      })
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findAll:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
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

      if (!findUser) throw new NotFoundException('user not found');
      
      const user = findUser.get();

      const data: InferAttributes<User> = {
        ...user,
        cardImageUrl: user.cardImageUrl ? `${process.env.APP_URL}/file/${user.cardImageUrl}` : ''
      }

      if (findUser) return responseTemplate(HttpStatus.OK, 'find one user', {
        data
      })

      throw new HttpException('user not found', HttpStatus.NOT_FOUND)
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`findOne:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProfile(userId: string, body: UpdateProfileRequest): Promise<DefaultResponse<FindOneUserResponse>> {
    try {
      this.logger.log('---UPDATE PROFILE---');
      this.logger.log(`updateProfile:::userId: ${userId}`);
      this.logger.log(`updateProfile:::body: ${JSON.stringify(body)}`);

      const { newUserId, cardImageUrl, ...bodyWithOutNewUserId } = body;

      const foundUser = await this.userRepositories.findByPk(userId);
      if (!foundUser) throw new NotFoundException('User With This Id Not Exist');

      if (userId !== newUserId) {
        const isExist = await this.userRepositories.findByPk(newUserId);
        if (isExist) throw new ConflictException('user with this id already exit');
      }

      const user = foundUser.get();

      if (cardImageUrl) {
        if (user.cardImageUrl) {
          const isExist = await fileIsAvailable(cardImageUrl);
          if (isExist) await unlink(`upload/${user.cardImageUrl}`);
        }
      }

      const updatedData: InferAttributes<User> = {
        ...user,
        userId: newUserId,
        cardImageUrl,
        ...bodyWithOutNewUserId
      }

      await foundUser.update(updatedData);

      return responseTemplate(HttpStatus.OK, 'User Updated', { data: foundUser });
    } catch (err) {
      const errMessage = generateErrMsg(err);
      this.logger.error(`updateProfile:::ERROR: ${errMessage}`);

      if (err instanceof HttpException) throw err;
      throw new HttpException(errMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
