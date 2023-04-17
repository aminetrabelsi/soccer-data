import { IsDefined } from 'class-validator';

export class CreateMatchRequest {
  @IsDefined()
  played!: Date;
  @IsDefined()
  venue!: string;
  @IsDefined()
  score!: string;
  @IsDefined()
  outcome!: number;
  @IsDefined()
  leagueId!: number;
  @IsDefined()
  host!: number;
  @IsDefined()
  guest!: number;
}
