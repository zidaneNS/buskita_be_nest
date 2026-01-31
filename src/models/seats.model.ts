import { BelongsTo, Column, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Bus } from "./buses.model";
import { User } from "./users.model";
import { Schedule } from "./schedules.model";
import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  tableName: 'seats',
  timestamps: true
})
export class Seat extends Model<
  InferAttributes<Seat>,
  InferCreationAttributes<Seat>
> {
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
  bus: CreationOptional<Bus>;

  @BelongsTo(() => User)
  user: CreationOptional<User>;

  @BelongsTo(() => Schedule)
  schedule: CreationOptional<Schedule>;
}