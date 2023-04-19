import { Match, MatchAttributes } from '../models/Match';

export const createMatch = async ({
  played,
  venue,
  score,
  outcome,
  leagueId,
  host,
  guest,
}: MatchAttributes): Promise<Match> => {
  const match = Match.build({ played, venue, score, outcome, leagueId, host, guest });
  return await match.save();
};

export const findById = async (id: number): Promise<Match | null> => {
  return await Match.findByPk(id);
};

export const findAll = async (offset:number, limit: number): Promise<Match[]> => {
  return await Match.findAll({offset, limit});
};
