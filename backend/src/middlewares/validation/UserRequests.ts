import { IsDefined } from 'class-validator';

export class SignUpRequest {
  @IsDefined()
  username!: string;
  @IsDefined()
  password!: string;
}

export class SignInRequest {
  @IsDefined()
  username!: string;
  @IsDefined()
  password!: string;
}
