import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSurveyImage1749178453004 implements MigrationInterface {
  name = 'addSurveyImage1749178453004';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" ADD "imageURL" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "imageURL"`);
  }
}
