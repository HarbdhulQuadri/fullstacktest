import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInfoTB } from './user-info.entity';

@Entity('UserAcademicsTB')
export class UserAcademicsTB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  schoolName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  degree: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  fieldOfStudy: string | null;

  @Column({ type: 'date', nullable: true })
  startDate: string | null;

  @Column({ type: 'date', nullable: true })
  endDate: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => UserInfoTB, (user) => user.academics, {
    onDelete: 'CASCADE',
  })
  user: UserInfoTB;
}
