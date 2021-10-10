import {MigrationInterface, QueryRunner} from "typeorm";

export class createSurvey1633895634762 implements MigrationInterface {
    name = 'createSurvey1633895634762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_6fc63fbc9e49684dd84eb22d9cb"`);
        await queryRunner.query(`CREATE TABLE "survey" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surveyTemplateId" integer, "creatorId" integer, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_d5ca7b574aa78e532eae7c895cc" FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_cdb7a72b955b60b44f84d9e97f7" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_6fc63fbc9e49684dd84eb22d9cb" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_6fc63fbc9e49684dd84eb22d9cb"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_cdb7a72b955b60b44f84d9e97f7"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_d5ca7b574aa78e532eae7c895cc"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_6fc63fbc9e49684dd84eb22d9cb" FOREIGN KEY ("surveyId") REFERENCES "reviewer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
