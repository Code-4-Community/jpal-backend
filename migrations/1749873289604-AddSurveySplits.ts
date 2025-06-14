import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSurveySplits1749873289604 implements MigrationInterface {
  name = 'AddSurveySplits1749873289604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Constrain column to [0, 100]
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "treatmentPercentage" INTEGER NOT NULL DEFAULT 50 CONSTRAINT validTreatmentPercentage CHECK ("treatmentPercentage" >= 0 AND "treatmentPercentage" <= 100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT validTreatmentPercentage;`);
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "treatmentPercentage"`);
  }
}
