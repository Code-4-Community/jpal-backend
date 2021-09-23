import { MigrationInterface, QueryRunner } from 'typeorm';

export class removedIsClaimedFromUser1632399687740
  implements MigrationInterface
{
  name = 'removedIsClaimedFromUser1632399687740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isClaimed"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isClaimed" boolean NOT NULL`,
    );
  }
}
