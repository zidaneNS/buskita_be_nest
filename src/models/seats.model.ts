import { BelongsTo, Column, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Bus } from "./buses.model";
import { User } from "./users.model";
import { Schedule } from "./schedules.model";

@Table({
  tableName: 'seats',
  timestamps: true
})
export class Seat extends Model {
  @PrimaryKey
  @Column
  seatId: string;

  @ForeignKey(() => Bus)
  @Column
  busId: string;

  @ForeignKey(() => User)
  @Column
  userId?: string;

  @ForeignKey(() => Schedule)
  @Column
  scheduleId: string;

  @Column
  seatNumber: number;

  @Column
  verified: boolean;

  @BelongsTo(() => Bus)
  bus: Bus;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Schedule)
  schedule: Schedule;
}