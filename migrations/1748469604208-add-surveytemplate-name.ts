import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSurveytemplateName1748469604208 implements MigrationInterface {
  name = 'addSurveytemplateName1748469604208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey_template" ADD COLUMN "name" character varying;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey_template" DROP COLUMN "name";`);
  }
}
