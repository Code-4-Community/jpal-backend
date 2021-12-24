import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSurveyModel1633284940968 implements MigrationInterface {
  name = 'addSurveyModel1633284940968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_9ebd630ebe2cda5dd203c74b851"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_05a3e7f4dee38025bf6f219c4ec"`,
    );
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "surveyTemplateId"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "creatorId"`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "uuid" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "surveyId" integer`);
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_6fc63fbc9e49684dd84eb22d9cb" FOREIGN KEY ("surveyId") REFERENCES "reviewer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_6fc63fbc9e49684dd84eb22d9cb"`,
    );
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "surveyId"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "uuid"`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "creatorId" integer`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "surveyTemplateId" integer`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "name" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_05a3e7f4dee38025bf6f219c4ec" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_9ebd630ebe2cda5dd203c74b851" FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
