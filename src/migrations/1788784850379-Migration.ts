import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788784850379 implements MigrationInterface {
    name = 'Migration1788784850379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_UserInfoTB" ("id" varchar PRIMARY KEY NOT NULL, "profilePhoto" varchar(512), "firstName" varchar(100) NOT NULL, "lastName" varchar(100) NOT NULL, "dob" date NOT NULL, "occupation" varchar(100), "gender" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "contactId" varchar, "addressId" varchar, "maidenName" varchar(100), CONSTRAINT "REL_471a3120468116d5a0a7a99db8" UNIQUE ("addressId"), CONSTRAINT "REL_03d8e4f31c75de49172ad80e34" UNIQUE ("contactId"), CONSTRAINT "FK_471a3120468116d5a0a7a99db8f" FOREIGN KEY ("addressId") REFERENCES "UserAddressTB" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_03d8e4f31c75de49172ad80e34f" FOREIGN KEY ("contactId") REFERENCES "UserContactTB" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_UserInfoTB"("id", "profilePhoto", "firstName", "lastName", "dob", "occupation", "gender", "createdAt", "updatedAt", "contactId", "addressId") SELECT "id", "profilePhoto", "firstName", "lastName", "dob", "occupation", "gender", "createdAt", "updatedAt", "contactId", "addressId" FROM "UserInfoTB"`);
        await queryRunner.query(`DROP TABLE "UserInfoTB"`);
        await queryRunner.query(`ALTER TABLE "temporary_UserInfoTB" RENAME TO "UserInfoTB"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserInfoTB" RENAME TO "temporary_UserInfoTB"`);
        await queryRunner.query(`CREATE TABLE "UserInfoTB" ("id" varchar PRIMARY KEY NOT NULL, "profilePhoto" varchar(512), "firstName" varchar(100) NOT NULL, "lastName" varchar(100) NOT NULL, "dob" date NOT NULL, "occupation" varchar(100), "gender" varchar(20) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "contactId" varchar, "addressId" varchar, CONSTRAINT "REL_471a3120468116d5a0a7a99db8" UNIQUE ("addressId"), CONSTRAINT "REL_03d8e4f31c75de49172ad80e34" UNIQUE ("contactId"), CONSTRAINT "FK_471a3120468116d5a0a7a99db8f" FOREIGN KEY ("addressId") REFERENCES "UserAddressTB" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_03d8e4f31c75de49172ad80e34f" FOREIGN KEY ("contactId") REFERENCES "UserContactTB" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "UserInfoTB"("id", "profilePhoto", "firstName", "lastName", "dob", "occupation", "gender", "createdAt", "updatedAt", "contactId", "addressId") SELECT "id", "profilePhoto", "firstName", "lastName", "dob", "occupation", "gender", "createdAt", "updatedAt", "contactId", "addressId" FROM "temporary_UserInfoTB"`);
        await queryRunner.query(`DROP TABLE "temporary_UserInfoTB"`);
    }

}
