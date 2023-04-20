import { League, LeagueAttributes } from '../models/League';

export const createLeague = async ({ name, country, season }: LeagueAttributes): Promise<League> => {
  const league = League.build({ name, country, season });
  return await league.save();
};

export const findById = async (id: number): Promise<League | null> => {
  return await League.findByPk(id);
};

export const findAll = async (offset: number, limit: number): Promise<League[]> => {
  return await League.findAll({ offset, limit });
};

export const deleteLeague = async (id: number): Promise<number> => {
  return await League.destroy({ where: { id } });
};
