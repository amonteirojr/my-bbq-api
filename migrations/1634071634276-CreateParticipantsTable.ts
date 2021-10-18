import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateParticipantsTable1634071634276
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'participant',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'barbecueUuid',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar(50)',
            isNullable: false,
          },
          {
            name: 'contributionAmount',
            type: 'numeric',
            isNullable: true,
            default: 0,
          },
          {
            name: 'paid',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            type: 'timestamp',
            name: 'createdAt',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            type: 'timestamp',
            name: 'updatedAt',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'participant',
      new TableForeignKey({
        referencedTableName: 'barbecue',
        name: 'FK_PARTICIPANT_BARBECUE_PARTICIPANT',
        referencedColumnNames: ['uuid'],
        columnNames: ['barbecueUuid'],
        onDelete: 'cascade',
      }),
    );

    await queryRunner.createUniqueConstraint(
      'participant',
      new TableUnique({
        columnNames: ['name', 'barbecueUuid'],
        name: 'UK_PARTICIPANT_1',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('participants');
  }
}
