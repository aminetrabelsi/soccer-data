import { IsDefined } from 'class-validator';

export class CreateLeagueRequest {
  @IsDefined()
  name!: string;
  @IsDefined()
  country!: string;
  @IsDefined()
  season!: string;
}
