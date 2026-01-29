import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Role } from "./roles.model";
import { Schedule } from "./schedules.model";
import { Seat } from "./seats.model";
import { ScheduleUser } from "./schedule_user.model";
import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";

export enum USER_STATUS {
  WaitingApproval = 'wait',
  Approve = 'approve',
  Reject = 'reject,'
}
@Table({
  timestamps: true,
  tableName: 'users'
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Column
  userId: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  phoneNumber: string;

  @Column
  address: string;

  @Column({
    type: DataType.INTEGER
  })
  creditScore: CreationOptional<number>;

  @Column({
    type: DataType.ENUM,
    values: ['wait', 'approve', 'reject']
  })
  status: CreationOptional<USER_STATUS>;

  @Column
  cardImageUrl?: string;

  @ForeignKey(() => Role)
  @Column
  roleId: number

  @BelongsTo(() => Role)
  role: CreationOptional<Role>;

  @BelongsToMany(() => Schedule, () => ScheduleUser)
  schedules: CreationOptional<Schedule[]>;

  @HasMany(() => Seat)
  seats: CreationOptional<Seat[]>;
}