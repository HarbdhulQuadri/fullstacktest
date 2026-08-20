import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoTB } from './entities/user-info.entity';
import { UserContactTB } from './entities/user-contact.entity';
import { UserAddressTB } from './entities/user-address.entity';
import { UserAcademicsTB } from './entities/user-academics.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInfoTB,
      UserContactTB,
      UserAddressTB,
      UserAcademicsTB,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
