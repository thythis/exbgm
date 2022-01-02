import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Tag } from "../entities/Tag";

@Resolver(Tag)
export class TagResolver {
  @Query(() => [Tag])
  async tags(): Promise<Tag[]> {
    const tags = await Tag.find({});
    return tags;
  }

  @Mutation(() => Tag)
  async createTag(@Arg("text") text: string): Promise<Tag> {
    return Tag.create({
      text,
    }).save();
  }
}
