import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';

export interface LeagueAttributes {
  id?: number;
  name?: string;
  country?: string;
  season?: string;
}

@Table({
  timestamps: false,
  tableName: 'leagues',
})
export class League extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
  country!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  season!: string;
}
