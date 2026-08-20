import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateUserInfoDto } from './create-user-info.dto';
import { CreateUserContactDto } from './create-user-contact.dto';
import { CreateUserAddressDto } from './create-user-address.dto';
import { CreateUserAcademicDto } from './create-user-academic.dto';

export class CreateUserDto {
  @ValidateNested()
  @Type(() => CreateUserInfoDto)
  userInfo: CreateUserInfoDto;

  @ValidateNested()
  @Type(() => CreateUserContactDto)
  userContact: CreateUserContactDto;

  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  userAddress: CreateUserAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserAcademicDto)
  userAcademics: CreateUserAcademicDto[];
}
