import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class users1603203399358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name : 'users',
            columns:[
              {
                name:'id',
                type:'integer',
                unsigned:true,
                isPrimary:true,
                isGenerated:true,
                generationStrategy:'increment',
              },
              {
                name:'nome',
                type:'varchar',
              },
              
              {
                name:'email',
                type:'varchar',
              },
            ]
          }))
        }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
