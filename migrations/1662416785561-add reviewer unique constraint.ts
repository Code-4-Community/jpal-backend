import {MigrationInterface, QueryRunner} from "typeorm";

export class addReviewerUniqueConstraint1662416785561 implements MigrationInterface {
    name = 'addReviewerUniqueConstraint1662416785561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviewer" ADD CONSTRAINT "UQ_21d2e21d55f11568d51a7acf953" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviewer" DROP CONSTRAINT "UQ_21d2e21d55f11568d51a7acf953"`);
    }

}
