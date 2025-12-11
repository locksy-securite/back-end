export class RegisterDto {
  email!: string;
  passwordHash!: string; // hex string
  salt!: string; // hex string
  envelope!: {
    type: 'registration';
    aad_json: any;
    data_b64: string;
  };
}
