import { MigrationInterface, QueryRunner } from "typeorm";

export class UserOptional1729028628666 implements MigrationInterface {
    name = 'UserOptional1729028628666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`);
    }

}
