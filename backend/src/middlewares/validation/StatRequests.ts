import { IsDefined } from 'class-validator';

export class CreateStatRequest {
  @IsDefined()
  goals!: number;
  @IsDefined()
  assists!: number;
  @IsDefined()
  saves!: number;
  @IsDefined()
  yellow!: number;
  @IsDefined()
  red!: number;
  @IsDefined()
  minutes!: number;
  @IsDefined()
  matchId!: number;
  @IsDefined()
  playerId!: number;
}
