/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, BadRequestException, Req, Post, Headers } from '@nestjs/common';
import { Posts } from 'src/entities/post.entity';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/dto/createPostDto';
import { UserDto } from 'src/dto/UserDto';
import { CreatePost } from 'src/business/CreatePost.decorator';

@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService) {}

    @Get()
    async getAllPosts(): Promise<Posts[]> {
        return await this.postService.findAllPost();
    }

    @Get(':postId')
    async getPostById(@Param() params): Promise<Posts> {
        if (!params.postId) {
            throw new BadRequestException();
        }
        const post: Posts = await this.postService.findPost(params.postId);
        return post;
    }

    @Post()
    async createPost(@Headers('authorization') userToken: string, @CreatePost() post: CreatePostDto): Promise<Posts> {
        if (!post.title || !post.content) {
            throw new BadRequestException('Invalid post content');
        }
        const user: UserDto = await this.postService.getUserData(userToken);
        const posted = await this.postService.createPost(user, post);
    
        return posted;
    }

}
