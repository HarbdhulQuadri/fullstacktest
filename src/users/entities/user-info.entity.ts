import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserContactTB } from './user-contact.entity';
import { UserAddressTB } from './user-address.entity';
import { UserAcademicsTB } from './user-academics.entity';

@Entity('UserInfoTB')
export class UserInfoTB {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  profilePhoto: string | null;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  dob: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occupation: string | null;

  @Column({ type: 'varchar', length: 20 })
  gender: string;

  @OneToOne(() => UserContactTB, (contact) => contact.user, {
    cascade: true,
  })
  @JoinColumn()
  contact: UserContactTB;

  @OneToOne(() => UserAddressTB, (address) => address.user, {
    cascade: true,
  })
  @JoinColumn()
  address: UserAddressTB;

  @OneToMany(() => UserAcademicsTB, (academic) => academic.user, {
    cascade: true,
  })
  academics: UserAcademicsTB[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
