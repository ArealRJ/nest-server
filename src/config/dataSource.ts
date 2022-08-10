import { DataSource, DataSourceOptions } from "typeorm"
import { PostsEntity } from "../posts/posts.entity"
import { ConfigService,ConfigModule } from "@nestjs/config"
import { AppModule } from "../app.module"

const configService = new ConfigService()
const dataSource: DataSourceOptions = {
  type:'mysql',
  port:Number(configService.get<number>('port', 3306)),
  host:configService.get('host', 'localhost'),
  username:configService.get('user', 'root'),
  password:configService.get('password','root'),
  database:configService.get('database', 'blog'),
}

const myDataSource = new DataSource(dataSource)


export { myDataSource }