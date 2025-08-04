import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionToSentence1754191149912 implements MigrationInterface {
  name = 'AddQuestionToSentence1754191149912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename the column in fragment table
    await queryRunner.query(`
      ALTER TABLE "fragment"
      RENAME COLUMN "includeIfSelectedOptions" TO "includeIfSelectedOption"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the column rename first
    await queryRunner.query(`
      ALTER TABLE "fragment"
      RENAME COLUMN "includeIfSelectedOption" TO "includeIfSelectedOptions"
    `);
  }
}
