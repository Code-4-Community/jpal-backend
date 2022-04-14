import {MigrationInterface, QueryRunner} from "typeorm";

export class addedDateToUser1649979729905 implements MigrationInterface {
    name = 'addedDateToUser1649979729905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "creation_date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "creation_date"`);
    }

}
