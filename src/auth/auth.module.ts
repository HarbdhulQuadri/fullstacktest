import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AdminUser]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (process.env.NODE_ENV === 'production' && !secret) {
          throw new Error('JWT_SECRET must be set in production');
        }
        return {
          secret: secret || 'dev-insecure-secret-change-me',
          signOptions: { expiresIn: JWT_EXPIRES_IN },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
