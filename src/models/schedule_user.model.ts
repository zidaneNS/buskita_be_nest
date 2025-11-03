import { Table, ForeignKey, Column, Model } from "sequelize-typescript";
import { Schedule } from "./schedules.model";
import { User } from "./users.model";

@Table({
  tableName: 'schedule_user'
})
export class ScheduleUser extends Model {
  @ForeignKey(() => Schedule)
  @Column
  scheduleId: string;

  @ForeignKey(() => User)
  @Column
  userId: string;
}