import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCitizenship1788785000000 implements MigrationInterface {
    name = 'AddCitizenship1788785000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn('UserInfoTB', 'citizenship');
        if (!hasColumn) {
            await queryRunner.addColumn(
                'UserInfoTB',
                new TableColumn({
                    name: 'citizenship',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn('UserInfoTB', 'citizenship');
        if (hasColumn) {
            await queryRunner.dropColumn('UserInfoTB', 'citizenship');
        }
    }

}
