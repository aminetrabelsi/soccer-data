import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';

export interface StatAttributes {
  id?: number;
  goals?: number;
  assists?: number;
  saves?: number;
  yellow?: number;
  red?: number;
  minutes?: number;
  matchId?: number;
  playerId?: number;
}

@Table({
  timestamps: false,
  tableName: 'stats',
})
export class Stat extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  goals!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  assists!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  yellow!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  red!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  minutes!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  matchId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  playerId!: number;
}
