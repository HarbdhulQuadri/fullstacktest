import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { LoginDto } from './dto/login.dto';

export interface AuthPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAdmin();
  }

  async validateUser(email: string, password: string): Promise<AdminUser | null> {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) {
      return null;
    }

    const matches = await bcrypt.compare(password, admin.passwordHash);
    return matches ? admin : null;
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const admin = await this.validateUser(dto.email, dto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: AuthPayload = { sub: admin.id, email: admin.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  private async seedAdmin(): Promise<void> {
    const email = process.env.ADMIN_SEED_EMAIL;
    const password = process.env.ADMIN_SEED_PASSWORD;

    if (!email || !password) {
      this.logger.warn(
        'ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set; skipping admin seed. ' +
          'Create an admin user before the API can be used.',
      );
      return;
    }

    const existing = await this.adminRepo.findOne({ where: { email } });
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.adminRepo.save(this.adminRepo.create({ email, passwordHash }));
    this.logger.log(`Seeded admin user: ${email}`);
  }
}
