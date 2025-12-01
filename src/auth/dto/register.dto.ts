export class RegisterDto {
  email!: string;
  passwordHash!: string; // hex string
  salt!: string; // hex string
}
