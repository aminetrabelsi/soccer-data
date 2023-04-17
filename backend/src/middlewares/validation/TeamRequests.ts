import { IsDefined } from 'class-validator';

export class CreateTeamRequest {
  @IsDefined()
  name!: string;
  @IsDefined()
  venue!: string;
  @IsDefined()
  founded!: string;
  @IsDefined()
  city!: string;
  @IsDefined()
  country!: string;
}
