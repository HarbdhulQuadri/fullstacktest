import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInfoTB } from './user-info.entity';

@Entity('UserContactTB')
export class UserContactTB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  fax: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  linkedInUrl: string | null;

  @OneToOne(() => UserInfoTB, (user) => user.contact)
  user: UserInfoTB;
}
