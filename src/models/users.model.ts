import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Role } from "./roles.model";
import { Schedule } from "./schedules.model";
import { Seat } from "./seats.model";
import { ScheduleUser } from "./schedule_user.model";

export enum USER_STATUS {
  WaitingApproval = 'wait',
  Approve = 'approve',
  Reject = 'reject,'
}
@Table({
  timestamps: true,
  tableName: 'users'
})
export class User extends Model {
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

  @Column
  creditScore: number;

  @Column
  status: USER_STATUS;

  @Column
  cardImageUrl?: string;

  @ForeignKey(() => Role)
  @Column
  roleId: number

  @BelongsTo(() => Role)
  role: Role;

  @BelongsToMany(() => Schedule, () => ScheduleUser)
  schedules: Schedule[];

  @HasMany(() => Seat)
  seats: Seat[];
}