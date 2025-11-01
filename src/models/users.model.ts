import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Role } from "./roles.model";

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
  phone_number: string;

  @Column
  address: string;

  @Column
  credit_score: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number

  @BelongsTo(() => Role)
  role: Role;
}