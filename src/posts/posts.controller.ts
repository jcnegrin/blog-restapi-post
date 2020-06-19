/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, BadRequestException, Req, Post, Headers } from '@nestjs/common';
import { Posts } from 'src/entities/post.entity';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { CreatePostDto } from 'src/dto/createPostDto';

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
    createPost(@Headers('authorization') userData: string, @Req() post: CreatePostDto): Promise<Posts> {
        if (!post.title || !post.content) {
            throw new BadRequestException('Invalid post content');
        }

        return ;
    }

}
