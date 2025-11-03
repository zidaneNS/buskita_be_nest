import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Schedule } from "./schedules.model";

@Table({
  tableName: 'routes',
  timestamps: true
})
export class Route extends Model {
  @PrimaryKey
  @Column
  routeId: string;

  @Column
  name: string;

  @HasMany(() => Schedule)
  schedules: Schedule[];
}