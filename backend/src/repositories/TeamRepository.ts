import { Team, TeamAttributes } from '../models/Team';

export const createTeam = async ({ name, founded, venue, city, country }: TeamAttributes): Promise<Team> => {
  const team = Team.build({ name, founded, venue, city, country });
  return await team.save();
};

export const findById = async (id: number): Promise<Team | null> => {
  return await Team.findByPk(id);
};

export const findAll = async (offset: number, limit: number): Promise<Team[]> => {
  return await Team.findAll({ offset, limit });
};
