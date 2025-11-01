import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./users.model";

@Table({
  tableName: 'roles',
  timestamps: true
})
export class Role extends Model {
  @PrimaryKey
  @Column
  roleId: number;

  @Column
  name: string;

  @HasMany(() => User)
  users: User;
}