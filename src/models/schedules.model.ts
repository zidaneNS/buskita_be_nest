import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Bus } from "./buses.model";
import { Route } from "./routes.model";
import { User } from "./users.model";
import { Seat } from "./seats.model";
import { ScheduleUser } from "./schedule_user.model";
import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  tableName: 'schedules',
  timestamps: true
})
export class Schedule extends Model<
  InferAttributes<Schedule>,
  InferCreationAttributes<Schedule>
> {
  @PrimaryKey
  @Column
  scheduleId: string;

  @Column
  time: Date;

  @Column({
    type: DataType.BOOLEAN,
  })
  isClosed: CreationOptional<boolean>;

  @Column({
    type: DataType.BOOLEAN,
  })
  isCompleted: CreationOptional<boolean>;

  @ForeignKey(() => Bus)
  @Column
  busId: string;

  @ForeignKey(() => Route)
  @Column
  routeId: string;

  @BelongsTo(() => Bus)
  bus: CreationOptional<Bus>;

  @BelongsTo(() => Route)
  route: CreationOptional<Route>;

  @BelongsToMany(() => User, () => ScheduleUser)
  users: CreationOptional<User[]>;

  @HasMany(() => Seat)
  seats: CreationOptional<Seat[]>;
}