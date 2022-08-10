import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局接口前缀
  app.setGlobalPrefix('api')
  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor())

  // swagger 配置
  const config = new DocumentBuilder()
    .setTitle('blog')   
    .setDescription('blog接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);



  await app.listen(3100);
}
bootstrap();
