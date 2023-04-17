import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';

export interface TeamAttributes {
  id?: number;
  name?: string;
  founded?: Date;
  venue?: string;
  city?: string;
  country?: string;
}

@Table({
  timestamps: false,
  tableName: 'teams',
})
export class Team extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  founded!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  venue!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country!: string;
}
