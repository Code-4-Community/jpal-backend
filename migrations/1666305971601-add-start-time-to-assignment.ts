import {MigrationInterface, QueryRunner} from "typeorm";

export class addStartTimeToAssignment1666305971601 implements MigrationInterface {
    name = 'addStartTimeToAssignment1666305971601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" ADD "started" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "started"`);
    }

}
