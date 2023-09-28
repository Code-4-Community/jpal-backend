import {MigrationInterface, QueryRunner} from "typeorm";

export class addDateToUser1695922686467 implements MigrationInterface {
    name = 'addDateToUser1695922686467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdDate"`);
    }

}
