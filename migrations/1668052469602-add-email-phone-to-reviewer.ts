import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEmailPhoneToReviewer1668052469602 implements MigrationInterface {
  name = 'addEmailPhoneToReviewer1668052469602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviewer" ADD "secondaryEmail" character varying`);
    await queryRunner.query(`ALTER TABLE "reviewer" ADD "phone" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviewer" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "reviewer" DROP COLUMN "secondaryEmail"`);
  }
}
