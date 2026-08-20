import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserInfoTB } from './entities/user-info.entity';
import { UserContactTB } from './entities/user-contact.entity';
import { UserAddressTB } from './entities/user-address.entity';
import { UserAcademicsTB } from './entities/user-academics.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly relations = ['contact', 'address', 'academics'];

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(UserInfoTB)
    private readonly usersRepo: Repository<UserInfoTB>,
    @InjectRepository(UserContactTB)
    private readonly contactRepo: Repository<UserContactTB>,
    @InjectRepository(UserAddressTB)
    private readonly addressRepo: Repository<UserAddressTB>,
    @InjectRepository(UserAcademicsTB)
    private readonly academicsRepo: Repository<UserAcademicsTB>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserInfoTB> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const usersRepo = manager.getRepository(UserInfoTB);
        const contactRepo = manager.getRepository(UserContactTB);

        const existingContact = await contactRepo.findOne({
          where: { email: dto.userContact.email },
        });
        if (existingContact) {
          throw new ConflictException('A user with that email already exists.');
        }

        const user = usersRepo.create({
          ...dto.userInfo,
          contact: dto.userContact,
          address: dto.userAddress,
          academics: dto.userAcademics,
        });

        return await usersRepo.save(user);
      });
    } catch (error: any) {
      if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('A user with that email already exists.');
      }
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: UserInfoTB[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.usersRepo.findAndCount({
      relations: this.relations,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<UserInfoTB> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: this.relations,
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserInfoTB> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const usersRepo = manager.getRepository(UserInfoTB);
        const academicsRepo = manager.getRepository(UserAcademicsTB);

        const user = await usersRepo.findOne({
          where: { id },
          relations: this.relations,
        });

        if (!user) {
          throw new NotFoundException(`User with id "${id}" not found`);
        }

        if (dto.userInfo) {
          usersRepo.merge(user, dto.userInfo);
        }

        if (dto.userContact) {
          if (dto.userContact.email && (!user.contact || user.contact.email !== dto.userContact.email)) {
            const contactRepo = manager.getRepository(UserContactTB);
            const existingContact = await contactRepo.findOne({
              where: { email: dto.userContact.email },
            });
            if (existingContact) {
              throw new ConflictException('A user with that email already exists.');
            }
          }
          if (user.contact) {
            Object.assign(user.contact, dto.userContact);
          } else {
            user.contact = manager.getRepository(UserContactTB).create(dto.userContact);
          }
        }

        if (dto.userAddress && user.address) {
          Object.assign(user.address, dto.userAddress);
        }

        if (dto.userAcademics) {
          await academicsRepo.delete({ user: { id } });
          user.academics = dto.userAcademics.map((academic) =>
            academicsRepo.create(academic),
          );
        }

        return await usersRepo.save(user);
      });
    } catch (error: any) {
      if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('A user with that email already exists.');
      }
      this.logger.error(`Failed to update user ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }
}
