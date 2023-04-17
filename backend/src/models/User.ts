import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';

export interface UserAttributes {
  id?: number;
  username?: string;
  password?: string;
}

@Table({
  timestamps: false,
  tableName: 'users',
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
}
