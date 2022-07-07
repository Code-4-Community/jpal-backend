import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSentToAssignment1657156231507 implements MigrationInterface {
  name = 'addSentToAssignment1657156231507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignment" ADD "sent" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "sent"`);
  }
}
