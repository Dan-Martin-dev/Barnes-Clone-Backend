import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedRatingsColumn1727724759559 implements MigrationInterface {
  name = 'DeletedRatingsColumn1727724759559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "rating"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD "rating" integer NOT NULL DEFAULT '5'`,
    );
  }
}
