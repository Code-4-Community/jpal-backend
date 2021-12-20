import { MigrationInterface, QueryRunner } from 'typeorm';

export class addControlYouth1639969840584 implements MigrationInterface {
  name = 'addControlYouth1639969840584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "youth" ADD "isControl" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "uuid"`);
    await queryRunner.query(`ALTER TABLE "youth" DROP COLUMN "isControl"`);
  }
}
