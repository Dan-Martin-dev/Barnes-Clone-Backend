import { MigrationInterface, QueryRunner } from 'typeorm';

export class MadeNameOptional1729028434257 implements MigrationInterface {
  name = 'MadeNameOptional1729028434257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
