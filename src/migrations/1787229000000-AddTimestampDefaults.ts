import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `DEFAULT CURRENT_TIMESTAMP` to the managed timestamp columns.
 *
 * `@CreateDateColumn()` / `@UpdateDateColumn()` make TypeORM rely on a
 * database-level default for the initial insert. The initial schema migration
 * created these columns as `NOT NULL` without a default, which works on SQLite
 * (dev) but violates the not-null constraint on PostgreSQL. This migration
 * backfills the defaults on PostgreSQL.
 */
export class AddTimestampDefaults1787229000000 implements MigrationInterface {
  name = 'AddTimestampDefaults1787229000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type !== 'postgres') {
      return;
    }

    await queryRunner.query(
      `ALTER TABLE "AdminUser" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserInfoTB" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserInfoTB" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.connection.options.type !== 'postgres') {
      return;
    }

    await queryRunner.query(
      `ALTER TABLE "AdminUser" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserInfoTB" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserInfoTB" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
  }
}
