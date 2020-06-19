import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Posts {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @PrimaryColumn()
    slug: string;

    @Column({type: 'longtext'})
    content: string;

    @Column({type: 'text'})
    description: string;

    @Column({nullable: true})
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(
        type => User,
        user => user.id
    )
    user: User;

}