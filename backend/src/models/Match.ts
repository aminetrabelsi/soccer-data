import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';

export interface MatchAttributes {
  id?: number;
  played?: Date;
  venue?: string;
  score?: string;
  outcome?: number;
  leagueId?: number;
  host?: number;
  guest?: number;
}

@Table({
  timestamps: false,
  tableName: 'matches',
})
export class Match extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  played!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  venue!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  score!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  outcome!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  host!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  guest!: number;
}
