import { IsDefined, IsOptional, IsISO8601 } from 'class-validator';

export class CreatePlayerRequest {
  @IsDefined()
  firstname!: string;
  @IsDefined()
  lastname!: string;
  @IsDefined()
  numero!: number;
  @IsDefined()
  @IsISO8601()
  birthdate!: string;
  @IsOptional()
  country!: string;
  @IsOptional()
  position!: string;
  @IsOptional()
  teamId!: number;
}

export class UpdatePlayerRequest {
  @IsOptional()
  country!: string;
  @IsOptional()
  numero!: number;
  @IsOptional()
  position!: string;
  @IsOptional()
  teamId!: number;
}

// RequestValidator.validate(GetPlayerStatsRequest)
