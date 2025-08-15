import { MigrationInterface, QueryRunner } from 'typeorm';

export class questionSurveytempManyToMany1753839095238 implements MigrationInterface {
  name = 'questionSurveytempManyToMany1753839095238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "question" DROP CONSTRAINT "FK_783cde4ed2147788de76868894f"
        `);

    // Drop the column itself
    await queryRunner.query(`
            ALTER TABLE "question" DROP COLUMN "surveyTemplateId"
        `);

    await queryRunner.query(`
        CREATE TABLE "question_surveytemplate" (
            "questionId" integer NOT NULL,
            "surveyTemplateId" integer NOT NULL,
            CONSTRAINT "PK_question_surveytemplate_ID" PRIMARY KEY ("questionId", "surveyTemplateId"),
            CONSTRAINT "FK_questionId" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_surveyTemplateId" FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id") ON DELETE CASCADE
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" ADD COLUMN "surveyTemplateId"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_surveyTemplateID" FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`DROP TABLE "question_surveytemplate"`);
  }
}
