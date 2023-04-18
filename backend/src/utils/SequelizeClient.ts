import { Sequelize } from 'sequelize-typescript';
import config from './Configuration';
import { Player } from '../models/Player';
import { Team } from '../models/Team';
import { League } from '../models/League';
import { Match } from '../models/Match';
import { Stat } from '../models/Stat';
import { User } from '../models/User';

const connection = new Sequelize({
  dialect: 'postgres',
  host: config.dbHost,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  logging: true,
  ssl: true,
  models: [Player, Team, League, Match, Stat, User],
});

Player.belongsTo(Team, {
  foreignKey: 'teamId',
});

Match.belongsTo(League, {
  foreignKey: 'leagueId',
});

Match.belongsTo(Team, {
  foreignKey: {
    name: 'host',
  },
  as: 'hostId',
});

Match.belongsTo(Team, {
  foreignKey: {
    name: 'guest',
  },
  as: 'guestId',
});

Stat.belongsTo(Match, {
  foreignKey: 'matchId',
});

Stat.belongsTo(Player, {
  foreignKey: 'playerId',
});

export default connection;
