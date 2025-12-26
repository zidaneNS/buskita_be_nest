import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Bus } from "./buses.model";
import { Route } from "./routes.model";
import { User } from "./users.model";
import { Seat } from "./seats.model";
import { ScheduleUser } from "./schedule_user.model";

@Table({
  tableName: 'schedules',
  timestamps: true
})
export class Schedule extends Model {
  @PrimaryKey
  @Column
  scheduleId: string;

  @Column
  time: Date;

  @Column
  isClosed: boolean;

  @ForeignKey(() => Bus)
  @Column
  busId: string;

  @ForeignKey(() => Route)
  @Column
  routeId: string;

  @BelongsTo(() => Bus)
  bus: Bus;

  @BelongsTo(() => Route)
  route: Route;

  @BelongsToMany(() => User, () => ScheduleUser)
  users: User[];

  @HasMany(() => Seat)
  seats: Seat[];
}