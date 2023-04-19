import { IsDefined } from 'class-validator';

export class CreateTeamRequest {
  @IsDefined()
  name!: string;
  @IsDefined()
  venue!: string;
  @IsDefined()
  founded!: Date;
  @IsDefined()
  city!: string;
  @IsDefined()
  country!: string;
}
