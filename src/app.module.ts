/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthMiddleware } from './business/auth.middleware';
import { PostsController } from './posts/posts.controller';
import { Posts } from './entities/post.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.AWS_MYSQL_HOST,
    port: 3306,
    username: process.env.AWS_MYSQL_USERNAME,
    password: process.env.AWS_MYSQL_PASSWORD,
    database: process.env.AWS_MYSQL_DATABASE,
    entities: [Posts, User, Role],
    synchronize: true,
  }), PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .forRoutes(PostsController);
  }
}
