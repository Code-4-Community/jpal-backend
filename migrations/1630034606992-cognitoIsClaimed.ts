import {MigrationInterface, QueryRunner} from "typeorm";

export class cognitoIsClaimed1630034606992 implements MigrationInterface {
    name = 'cognitoIsClaimed1630034606992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "password" TO "isClaimed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isClaimed"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isClaimed" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isClaimed"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isClaimed" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isClaimed" TO "password"`);
    }

}
