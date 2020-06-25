import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { Repository, getConnection, getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { UserDto } from 'src/dto/UserDto';
import { CreatePostDto } from 'src/dto/CreatePostDto';
import { User } from 'src/entities/user.entity';
import * as AWS from 'aws-sdk';
import { getGetSignedUrl, getPutSignedUrl } from 'src/business/aws';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
    
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
      ) {}

      findAllPost(): Promise<Posts[]> {
            return this.postsRepository.find({relations: ['user']});
      }

      async findPost(postIdOrSlug: string): Promise<Posts> {
            const post = await getRepository(Posts)
                  .createQueryBuilder('post')
                  .where("post.id = :postIdOrSlug", {postIdOrSlug})
                  .orWhere("post.slug = :postIdOrSlug", {postIdOrSlug} )
                  .leftJoinAndSelect('post.user', 'user')
                  .getOne();
            return post;
      }

      async createPost(user: UserDto, post: CreatePostDto): Promise<Posts> {

            const postDescriptionLength = post.content.length / 2;
            const newPost = new Posts();
            newPost.title = post.title;
            newPost.slug = this.sanitizeSlug(post.title);
            newPost.content = post.content;
            newPost.description = post.content.substring(0, postDescriptionLength);
            newPost.image = post.image || null;

            // Getting User from DB to make the relation
            const userRepository = getRepository(User);
            const postUser: User = await userRepository.findOne({where: {id: user.id, user_id: user.user_id, email: user.email}});
            // -----------------------------------------
            newPost.user = postUser;

           return await this.postsRepository.save(newPost);
      }

      private sanitizeSlug(slug: string): string {
          const invalidCharacter = /[!@#$%^&*(),.?":{}|<>\\\/]/g;
          const spaceCharacter = /\s+/g;
          let sanitizedSlug: string = slug;
          sanitizedSlug = sanitizedSlug.trim();
          sanitizedSlug = sanitizedSlug.toLowerCase();
          sanitizedSlug = sanitizedSlug.replace(invalidCharacter, '');
          sanitizedSlug = sanitizedSlug.replace(spaceCharacter, '-');
          return sanitizedSlug;
      }

      async getUserData(authorizationToken: string): Promise<UserDto> {
            const bearer_token = authorizationToken.split(' ');
            const token = bearer_token[1];
            const userInfo: UserDto = await jwt.verify(token, process.env.JWT_SECRET) as UserDto;
            return userInfo;
      }

      generateGetSignedURL(imageId: string): string {
            return getGetSignedUrl(imageId);
      }

      generatePutSignedURL(): string {
            const uuid = uuidv4();
            return getPutSignedUrl(uuid);
      }
}
