import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReminderSend1666303669991 implements MigrationInterface {
  name = 'addReminderSend1666303669991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD "reminderSent" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "reminderSent"`);
  }
}
