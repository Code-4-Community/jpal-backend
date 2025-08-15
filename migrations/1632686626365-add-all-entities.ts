import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAllEntities1632686626365 implements MigrationInterface {
  name = 'addAllEntities1632686626365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "survey_template" ("id" SERIAL NOT NULL, "creatorId" integer, CONSTRAINT "PK_8b3e1033e973713d55f190b811d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "surveyTemplateId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reviewer" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_677dfc9088091c469b6ee6a9c93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "youth" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_0775a892ec133870a85fd01b340" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assignment" ("id" SERIAL NOT NULL, "completed" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "surveyTemplateId" integer, "reviewerId" integer, "youthId" integer, "creatorId" integer, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "option" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "questionId" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "response" ("id" SERIAL NOT NULL, "questionId" integer, "optionId" integer, "assignmentId" integer, CONSTRAINT "PK_f64544baf2b4dc48ba623ce768f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_template" ADD CONSTRAINT "FK_d724b8b4286001b18a2c06ee030" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_783cde4ed2147788de76868894f" FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_9ebd630ebe2cda5dd203c74b851" FOREIGN KEY ("surveyTemplateId") REFERENCES "survey_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_872b31c38d50710f348ff03a9d9" FOREIGN KEY ("reviewerId") REFERENCES "reviewer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_3a6d6b365b8c39c39c57bb79965" FOREIGN KEY ("youthId") REFERENCES "youth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_05a3e7f4dee38025bf6f219c4ec" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" ADD CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_dfd952a4d26cf661248efec5f37" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_5c5860b62ee4054b0818879002e" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_10eddbd4b67e077f605662859c5" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_10eddbd4b67e077f605662859c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_5c5860b62ee4054b0818879002e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_dfd952a4d26cf661248efec5f37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" DROP CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_05a3e7f4dee38025bf6f219c4ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_3a6d6b365b8c39c39c57bb79965"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_872b31c38d50710f348ff03a9d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_9ebd630ebe2cda5dd203c74b851"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_783cde4ed2147788de76868894f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_template" DROP CONSTRAINT "FK_d724b8b4286001b18a2c06ee030"`,
    );
    await queryRunner.query(`DROP TABLE "response"`);
    await queryRunner.query(`DROP TABLE "option"`);
    await queryRunner.query(`DROP TABLE "assignment"`);
    await queryRunner.query(`DROP TABLE "youth"`);
    await queryRunner.query(`DROP TABLE "reviewer"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "survey_template"`);
  }
}
