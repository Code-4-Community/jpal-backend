import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParagraphEntity1753377136366 implements MigrationInterface {
  name = 'AddParagraphEntity1753377136366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "paragraph" (
            "id" SERIAL NOT NULL,
            "order" INTEGER NOT NULL,
            CONSTRAINT "PK_paragraph_id" PRIMARY KEY ("id")
    )
    `);

    await queryRunner.query(`
        CREATE TABLE "paragraph_sentences" (
            "paragraphId" integer NOT NULL,
            "sentenceId" integer NOT NULL,
            CONSTRAINT "PK_paragraph_sentences" PRIMARY KEY ("paragraphId", "sentenceId"),
            CONSTRAINT "FK_paragraphId" FOREIGN KEY ("paragraphId") REFERENCES "paragraph"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_sentenceId" FOREIGN KEY ("sentenceId") REFERENCES "sentence"("id") ON DELETE CASCADE
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "paragraph"`);
    await queryRunner.query(`DROP TABLE "paragraph_sentences"`);
  }
}
