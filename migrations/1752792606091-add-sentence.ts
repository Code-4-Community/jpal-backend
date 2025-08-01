import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSentence1752792606091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sentence" ("id" SERIAL NOT NULL, "template" character varying NOT NULL, "multiTemplate" character varying, "isPlainText" boolean NOT NULL, "isMultiQuestion" boolean NOT NULL, "includeIfSelectedOptions" text[] NOT NULL DEFAULT '{}', "questionId" INTEGER UNIQUE, CONSTRAINT "PK_sentence_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`ALTER TABLE "question" ADD "sentenceId" integer UNIQUE `);

    await queryRunner.query(`
      ALTER TABLE "question"
      ADD CONSTRAINT "FK_question_sentence" FOREIGN KEY ("sentenceId") REFERENCES "sentence"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
        ALTER TABLE "sentence"
            ADD CONSTRAINT "FK_sentence_question" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_question_sentence"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "sentenceId"`);
    await queryRunner.query(`DROP TABLE "sentence"`);
  }
}
