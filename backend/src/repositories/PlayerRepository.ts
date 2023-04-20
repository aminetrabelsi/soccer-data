import { Op } from 'sequelize';
import { Player, PlayerAttributes } from '../models/Player';

export const createPlayer = async ({
  firstname,
  lastname,
  numero,
  birthdate,
  country,
  position,
}: PlayerAttributes): Promise<Player> => {
  const player = Player.build({ firstname, lastname, numero, birthdate, country, position });
  return await player.save();
};

export const updatePlayer = async ({
  id,
  country,
  position,
  teamId,
}: PlayerAttributes): Promise<[affectedCount: number]> => {
  return await Player.update(
    { country, position, teamId },
    {
      where: {
        id,
      },
    },
  );
};

export const findByName = async (name: string): Promise<Player[] | null> => {
  return await Player.findAll({
    where: {
      [Op.or]: [{ firstname: name }, { lastname: name }],
    },
  });
};

export const findByTeam = async (id: number): Promise<Player[] | null> => {
  return await Player.findAll({
    where: {
      teamId: id,
    },
  });
};

export const findById = async (id: number): Promise<Player | null> => {
  return await Player.findByPk(id);
};

export const findAll = async (offset: number, limit: number): Promise<Player[]> => {
  return await Player.findAll({ offset, limit });
};
