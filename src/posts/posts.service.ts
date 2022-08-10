
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PostsEntity } from './posts.entity';
// import { myDataSource } from "../config/dataSource"
// myDataSource.getMetadata(PostsEntity)

export interface PostsRo {
  list: PostsEntity[],
  count: number
}


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>, 
    private dataSource: DataSource) {}

  /**
   * @创建文章
   */
  async create(post): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }

  /**
   * @获取文章列表
   */
  async findAll(query): Promise<PostsRo> {
    const qb = await this.dataSource.getRepository(PostsEntity).createQueryBuilder('posts');
    qb.where('1=1');
    qb.orderBy('posts.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count };
  }

  /**
   * @获取指定文章
   */
  async findById(id): Promise<PostsEntity> {
    // console.log(id);
    return await this.postsRepository.findOneBy({ id: id });
  }

  /**
   * @更新文章
   */
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  /**
   * @删除文章
   */
  async deleteById(id): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return this.postsRepository.remove(existPost);
  }
}
