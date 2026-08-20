import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(512)
  profilePhoto?: string | null;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsDateString()
  dob: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string | null;

  @IsString()
  @MaxLength(20)
  gender: string;
}
