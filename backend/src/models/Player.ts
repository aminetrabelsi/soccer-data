import { Table, Model, Column, DataType, PrimaryKey } from 'sequelize-typescript';

export interface PlayerAttributes {
  id?: number;
  firstname?: string;
  lastname?: string;
  birthdate?: Date;
  country?: string;
  position?: string;
  numero?: number;
  teamId?: number;
}

@Table({
  timestamps: false,
  tableName: 'players',
})
export class Player extends Model {
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
  firstname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  birthdate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  position!: string;

  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    allowNull: false,
  })
  numero!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  teamId!: number;
}
