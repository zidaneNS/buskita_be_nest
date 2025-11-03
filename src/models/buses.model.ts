import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Schedule } from "./schedules.model";
import { Seat } from "./seats.model";

@Table({
  tableName: 'buses',
  timestamps: true
})
export class Bus extends Model {
  @PrimaryKey
  @Column
  busId: string;

  @Column
  name: string;

  @Column
  totalRow: number;

  @Column
  totalCol: number;

  @Column
  totalBackseat: number;

  @HasMany(() => Schedule)
  schedules: Schedule[];

  @HasMany(() => Seat)
  seats: Seat[];
}