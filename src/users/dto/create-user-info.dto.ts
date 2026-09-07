import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

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

  @ValidateIf(
    (o: CreateUserInfoDto) =>
      o.gender?.toLowerCase() === 'female' ||
      (o.maidenName !== null && o.maidenName !== undefined && o.maidenName !== ''),
  )
  @IsNotEmpty({ message: 'Maiden name is required for female users' })
  @IsString()
  @MaxLength(100)
  maidenName?: string | null;
}
