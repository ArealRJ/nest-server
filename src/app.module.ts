import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PostsEntity } from './posts/posts.entity';
import envConfig from './config/env';
import { DataSource, DataSourceOptions } from 'typeorm';


@Module({
  imports: [PostsModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [envConfig.path],
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity],  // 数据表实体
        host: configService.get('host', 'localhost'), // 主机，默认为localhost
        port: Number(configService.get<number>('port', 3306)), // 端口号
        username: configService.get('user', 'root'),   // 用户名
        password: configService.get('password', 'root'), // 密码
        database: configService.get('database', 'blog'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        autoLoadEntities: true
      }),

    })
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[TypeOrmModule]
})

export class AppModule { 
  constructor(private dataSource:DataSource){
  }
}
