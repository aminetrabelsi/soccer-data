import { Stat, StatAttributes } from '../models/Stat';

export const createStat = async ({
  goals,
  assists,
  saves,
  yellow,
  red,
  minutes,
  matchId,
  playerId,
}: StatAttributes): Promise<Stat> => {
  const stat = Stat.build({ goals, assists, saves, yellow, red, minutes, matchId, playerId });
  return await stat.save();
};

export const findById = async (id: number): Promise<Stat | null> => {
  return await Stat.findByPk(id);
};

export const findByPlayer = async (id: number): Promise<Stat[] | null> => {
  return await Stat.findAll({
    where: {
      playerId: id,
    },
  });
};

export const findByPlayerAndMatch = async (id: number, match: number): Promise<Stat | null> => {
  return await Stat.findOne({
    where: {
      playerId: id,
      matchId: match,
    },
  });
};

export const findAll = async (offset: number, limit: number): Promise<Stat[]> => {
  return await Stat.findAll({ offset, limit });
};
