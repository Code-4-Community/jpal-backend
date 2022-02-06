import {MigrationInterface, QueryRunner} from "typeorm";

export class addDateToSurvey1644181216652 implements MigrationInterface {
    name = 'addDateToSurvey1644181216652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reviewer" ADD CONSTRAINT "UQ_5450a3018dbeee057430f868c47" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "youth" ADD CONSTRAINT "UQ_17aea0e2db510bd7cd20150602c" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "youth" DROP CONSTRAINT "UQ_17aea0e2db510bd7cd20150602c"`);
        await queryRunner.query(`ALTER TABLE "reviewer" DROP CONSTRAINT "UQ_5450a3018dbeee057430f868c47"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "date"`);
    }

}
