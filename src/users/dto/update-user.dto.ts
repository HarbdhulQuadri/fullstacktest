import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { UpdateUserInfoDto } from './update-user-info.dto';
import { UpdateUserContactDto } from './update-user-contact.dto';
import { UpdateUserAddressDto } from './update-user-address.dto';
import { UpdateUserAcademicDto } from './update-user-academic.dto';

export class UpdateUserDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserInfoDto)
  userInfo?: UpdateUserInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserContactDto)
  userContact?: UpdateUserContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserAddressDto)
  userAddress?: UpdateUserAddressDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserAcademicDto)
  userAcademics?: UpdateUserAcademicDto[];
}
