import {MigrationInterface, QueryRunner} from "typeorm";

export class s3LetterLink1743470215734 implements MigrationInterface {
    name = 's3LetterLink1743470215734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" ADD "s3LetterLink" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "s3LetterLink"`);
    }

}
