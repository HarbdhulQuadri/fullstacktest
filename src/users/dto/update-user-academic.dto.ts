import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAcademicDto } from './create-user-academic.dto';

export class UpdateUserAcademicDto extends PartialType(CreateUserAcademicDto) {}
