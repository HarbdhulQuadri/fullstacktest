import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(512)
  profilePhoto?: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsDateString()
  dob: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  gender: string;
}
