import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAssignmentStatus1640018111752 implements MigrationInterface {
  name = 'addAssignmentStatus1640018111752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignment" RENAME COLUMN "completed" TO "status"`);
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "assignment_status_enum" AS ENUM('incomplete', 'in_progress', 'complete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD "status" "assignment_status_enum" NOT NULL DEFAULT 'incomplete'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "assignment_status_enum"`);
    await queryRunner.query(`ALTER TABLE "assignment" ADD "status" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "assignment" RENAME COLUMN "status" TO "completed"`);
  }
}
