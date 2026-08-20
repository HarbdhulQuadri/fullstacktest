import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserAcademicDto {
  @IsString()
  @MaxLength(255)
  schoolName: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  degree?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  fieldOfStudy?: string | null;

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
