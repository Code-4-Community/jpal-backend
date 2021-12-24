import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReviewerUuid1640012056080 implements MigrationInterface {
  name = 'addReviewerUuid1640012056080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviewer" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "uuid"`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "uuid" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "reviewer" DROP COLUMN "uuid"`);
  }
}
