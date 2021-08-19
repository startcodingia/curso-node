import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Author } from './author.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Book {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string

    @Field(() => Author)
    @ManyToOne(() => Author, author => author.books, { onDelete: 'CASCADE' })
    author!: Author

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}