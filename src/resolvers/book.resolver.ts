import { Mutation, Resolver, Arg, InputType, Field, Query, UseMiddleware, Ctx } from 'type-graphql';
import { getRepository, Repository } from "typeorm";
import { Author } from '../entity/author.entity';
import { Book } from '../entity/book.entity';
import { Length } from 'class-validator';
import { IContext, isAuth } from '../middlewares/auth.middleware';

@InputType()
class BookInput {

    @Field()
    @Length(3, 64)
    title!: string;

    @Field()
    author!: number;
}

@InputType()
class BookUpdateInput {

    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Number, { nullable: true })
    author?: number;
}

@InputType()
class BookUpdateParsedInput {

    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Author, { nullable: true })
    author?: Author;
}

@InputType()
class BookIdInput {

    @Field(() => Number)
    id!: number
}


@Resolver()
export class BookResolver {
    bookRepository: Repository<Book>;
    authorRepository: Repository<Author>

    constructor() {
        this.bookRepository = getRepository(Book);
        this.authorRepository = getRepository(Author);
    }

    @Mutation(() => Book)
    @UseMiddleware(isAuth)
    async createBook(@Arg("input", () => BookInput) input: BookInput, @Ctx() context: IContext) {
        try {
            console.log(context.payload)
            const author: Author | undefined = await this.authorRepository.findOne(input.author);

            if (!author) {
                const error = new Error();
                error.message = 'The author for this book does not exist, please double check';
                throw error;
            }

            const book = await this.bookRepository.insert({
                title: input.title,
                author: author
            });

            return await this.bookRepository.findOne(book.identifiers[0].id, { relations: ['author', 'author.books'] })


        } catch (e) {
            throw new Error(e.message)
        }
    }

    @Query(() => [Book])
    @UseMiddleware(isAuth)
    async getAllBooks(): Promise<Book[]> {
        try {
            return await this.bookRepository.find({ relations: ['author', 'author.books'] })
        } catch (e) {
            throw new Error(e)
        }
    }

    @Query(() => Book)
    async getBookById(
        @Arg('input', () => BookIdInput) input: BookIdInput
    ): Promise<Book | undefined> {
        try {
            const book = await this.bookRepository.findOne(input.id, { relations: ['author', 'author.books'] });
            if (!book) {
                const error = new Error();
                error.message = 'Book not found';
                throw error;
            }
            return book;
        } catch (e) {
            throw new Error(e)
        }
    }

    @Mutation(() => Boolean)
    async updateBookById(
        @Arg('bookId', () => BookIdInput) bookId: BookIdInput,
        @Arg('input', () => BookUpdateInput) input: BookUpdateInput,
    ): Promise<Boolean> {
        try {
            await this.bookRepository.update(bookId.id, await this.parseInput(input));
            return true;
        } catch (e) {
            throw new Error(e)
        }
    }

    @Mutation(() => Boolean)
    async deleteBook(
        @Arg("bookId", () => BookIdInput) bookId: BookIdInput
    ): Promise<Boolean> {
        try {
            const result = await this.bookRepository.delete(bookId.id)

            if (result.affected === 0) throw new Error('Book does not exist');

            return true
        } catch (e) {
            throw new Error(e)
        }
    }

    private async parseInput(input: BookUpdateInput) {
        try {
            const _input: BookUpdateParsedInput = {};

            if (input.title) {
                _input['title'] = input.title;
            }

            if (input.author) {
                const author = await this.authorRepository.findOne(input.author);
                if (!author) {
                    throw new Error('This author does not exist')
                }
                _input['author'] = await this.authorRepository.findOne(input.author);
            }

            return _input;
        } catch (e) {
            throw new Error(e)
        }
    }

}