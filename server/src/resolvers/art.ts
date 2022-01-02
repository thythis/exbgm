import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Any, getConnection } from "typeorm";
import { resourceLimits } from "worker_threads";
import { Art } from "../entities/Art";
import { Brand } from "../entities/Brand";
import { Tag } from "../entities/Tag";
import { MyContext } from "../types";

@InputType()
class ArtInput {
  @Field()
  name: string;
  @Field()
  brandId: number;
  @Field(() => [Number], { defaultValue: [] })
  tags: number[];
}

@Resolver(Art)
export class ArtResolver {
  @FieldResolver(() => Brand)
  async brand(@Root() art: Art, @Ctx() { brandLoader }: MyContext) {
    return brandLoader.load(art.brandId);
  }

  @FieldResolver(() => [Tag])
  async tags(@Root() art: Art) {
    const tagsOfArt = await getConnection()
      // .query(`
      // select
      // `,)
      .getRepository(Tag)
      // .find({ relations: ["arts"], where: { art } });
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.arts", "art")
      .where("art.id = :id", { id: art.id })
      .getMany();
    return tagsOfArt;
  }

  @Query(() => [Art])
  async arts(): Promise<Art[]> {
    const arts = await Art.find({});

    return arts;
  }

  @Query(() => [Art])
  async artsByBrandId(@Arg("brandId") brandId: number): Promise<Art[]> {
    const arts = await Art.find({ where: { brandId } });

    return arts;
  }

  @Query(() => [Art])
  async artsByTags(
    @Arg("tags", () => [Number]) tags: number[]
  ): Promise<Art[]> {
    const artsWithTags = await getConnection()
      .getRepository(Art)
      .createQueryBuilder("a")
      .innerJoinAndSelect("a.tags", "t")
      .where("t.id in (:...tags)", { tags })
      .getMany();

    return artsWithTags.filter((art) => art.tags.length === tags.length);
  }

  @Mutation(() => Art)
  async createArt(@Arg("input") input: ArtInput): Promise<Art> {
    const tags = input.tags.map((tag) => ({ id: tag }));
    return Art.create({
      ...input,
      tags,
    }).save();
  }

  @Mutation(() => Boolean)
  async updateTags(
    @Arg("id", () => Int) id: number,
    @Arg("tags", () => [Number]) tags: number[]
  ): Promise<Boolean> {
    // const art = await Art.findOne({ id });
    const tagIdGroup = tags.reduce(
      (prev, curr, index) =>
        prev + `(${id}, ${curr})${index === tags.length - 1 ? ";" : ","}`,
      ""
    );

    await getConnection().transaction(async (tm) => {
      await tm.query(
        `
      delete from art_tags_tag
      where "artId" = $1
      `,
        [id]
      );

      await tm.query(
        `
      insert into art_tags_tag ("artId", "tagId")
      values 
      ${tagIdGroup}
      `
      );
    });

    return true;
  }
}
