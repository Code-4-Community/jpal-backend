import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSurveyOrganizationName1749178685444 implements MigrationInterface {
  name = 'addSurveyOrganizationName1749178685444';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" ADD "organizationName" character varying not null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "organizationName"`);
  }
}
