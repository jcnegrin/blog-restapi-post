import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { UserDto } from 'src/dto/UserDto';

@Injectable()
export class PostsService {
    
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
      ) {}

      findAllPost(): Promise<Posts[]> {
          return this.postsRepository.find();
      }

      findPost(postId: string): Promise<Posts> {
          return this.postsRepository.findOne(postId);
      }

      async createPost(post: Posts): Promise<void> {
          await this.postsRepository.save(post);
      }

      async getUserData(authorizationToken: string): Promise<UserDto> {
        const bearer_token = authorizationToken.split(' ');
        const token = bearer_token[1];
        const userInfo: UserDto = await jwt.verify(token, process.env.JWT_SECRET) as UserDto;
        return userInfo;
      }
}
