import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1788784850379 implements MigrationInterface {
    name = 'Migration1788784850379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn('UserInfoTB', 'maidenName');
        if (!hasColumn) {
            await queryRunner.addColumn(
                'UserInfoTB',
                new TableColumn({
                    name: 'maidenName',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn('UserInfoTB', 'maidenName');
        if (hasColumn) {
            await queryRunner.dropColumn('UserInfoTB', 'maidenName');
        }
    }

}
