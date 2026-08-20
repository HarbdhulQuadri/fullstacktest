import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
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
        const provided = process.env.JWT_SECRET;
        // Fall back to an ephemeral secret so the service can boot on platforms
        // (e.g. Render) where env vars aren't pre-set. Set JWT_SECRET for
        // stable tokens across restarts.
        const secret = provided || randomBytes(32).toString('hex');
        if (!provided) {
          // eslint-disable-next-line no-console
          console.warn(
            '[auth] JWT_SECRET not set; using an auto-generated ephemeral ' +
              'secret. Set JWT_SECRET in the environment for stable tokens.',
          );
        }
        return {
          secret,
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
