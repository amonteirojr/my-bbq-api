import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddUserIdToBarbecueTable1634577903618
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'barbecue',
      new TableColumn({ name: 'userUuid', type: 'uuid', isNullable: false }),
    );

    await queryRunner.createForeignKey(
      'barbecue',
      new TableForeignKey({
        name: 'FK_BARBECUE_USERS_BARBECUE',
        referencedColumnNames: ['uuid'],
        columnNames: ['userUuid'],
        referencedTableName: 'user',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('barbecue', 'FK_BARBECUE_USERS_BARBECUE');
    await queryRunner.dropColumn('barbecue', 'userUuid');
  }
}
