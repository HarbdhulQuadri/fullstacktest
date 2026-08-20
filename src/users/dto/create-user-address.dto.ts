import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserAddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  zipCode: string;
}
