import { IsString, MaxLength } from 'class-validator';

export class CreateUserAddressDto {
  @IsString()
  @MaxLength(255)
  address: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(100)
  state: string;

  @IsString()
  @MaxLength(100)
  country: string;

  @IsString()
  @MaxLength(20)
  zipCode: string;
}
