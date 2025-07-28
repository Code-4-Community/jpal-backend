import {MigrationInterface, QueryRunner} from "typeorm";

export class fixedSurveyTemplate1753738609912 implements MigrationInterface {
    name = 'fixedSurveyTemplate1753738609912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_template" ADD COLUMN "greeting" text NOT NULL DEFAULT ' '`);
        await queryRunner.query(`ALTER TABLE "survey_template" ADD COLUMN "closing" text NOT NULL DEFAULT ' ' `);
        await queryRunner.query(`ALTER TABLE "paragraph" ADD COLUMN "surveyTemplateId" INTEGER`);
        await queryRunner.query(`ALTER TABLE "paragraph"
        ADD CONSTRAINT "FK_paragraph_surveyTemplate"
        FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paragraph" DROP CONSTRAINT "FK_paragraph_surveyTemplate"`);
        await queryRunner.query(`DROP TABLE "survey_template"`);
        await queryRunner.query(`ALTER TABLE "paragraph" DELETE COLUMN "surveyTemplateId"`);
    }

}
