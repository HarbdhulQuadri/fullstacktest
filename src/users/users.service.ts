import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.dataSource.transaction(async (manager) => {
      const usersRepo = manager.getRepository(UserInfoTB);

      const user = usersRepo.create({
        ...dto.userInfo,
        contact: dto.userContact,
        address: dto.userAddress,
        academics: dto.userAcademics,
      });

      return usersRepo.save(user);
    });
  }

  async findAll(): Promise<UserInfoTB[]> {
    return this.usersRepo.find({ relations: this.relations });
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
    return this.dataSource.transaction(async (manager) => {
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

      if (dto.userContact && user.contact) {
        Object.assign(user.contact, dto.userContact);
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

      return usersRepo.save(user);
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }
}
