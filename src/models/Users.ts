import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from 'typeorm';

@Entity('users')
export default class User{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column()
    nome: string;

    @Column()
    password: string;

    @Column()
    email: string;
}