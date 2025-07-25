import { MigrationInterface, QueryRunner } from 'typeorm';

export class fragments1753369615805 implements MigrationInterface {
  name = 'fragments1753369615805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fragment" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "includeIfSelectedOptions" text NOT NULL, "questionId" INTEGER, "sentenceId" INTEGER, CONSTRAINT "PK_fragment_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`
      ALTER TABLE "fragment"
      ADD CONSTRAINT "FK_question_fragment" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "fragment"
      ADD CONSTRAINT "FK_sentence_fragment" FOREIGN KEY ("sentenceId") REFERENCES "sentence"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "fragment"`);
  }
}
