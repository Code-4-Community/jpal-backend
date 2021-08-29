import { MigrationInterface, QueryRunner } from 'typeorm';

export class posts1630279834302 implements MigrationInterface {
  name = 'posts1630279834302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
