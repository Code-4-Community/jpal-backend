import { MigrationInterface, QueryRunner } from 'typeorm';

export class addYouthRoles1640020010007 implements MigrationInterface {
  name = 'addYouthRoles1640020010007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "youth" RENAME COLUMN "isControl" TO "role"`);
    await queryRunner.query(`ALTER TABLE "youth" DROP COLUMN "role"`);
    await queryRunner.query(`CREATE TYPE "youth_role_enum" AS ENUM('treatment', 'control')`);
    await queryRunner.query(
      `ALTER TABLE "youth" ADD "role" "youth_role_enum" NOT NULL DEFAULT 'treatment'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "youth" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "youth_role_enum"`);
    await queryRunner.query(`ALTER TABLE "youth" ADD "role" boolean NOT NULL`);
    await queryRunner.query(`ALTER TABLE "youth" RENAME COLUMN "role" TO "isControl"`);
  }
}
