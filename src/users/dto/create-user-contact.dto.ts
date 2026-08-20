import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserContactDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(30)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  fax?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  linkedInUrl?: string | null;
}
