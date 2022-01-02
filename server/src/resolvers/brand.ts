import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Brand } from "../entities/Brand";

@Resolver(Brand)
export class BrandResolver {
  @Query(() => [Brand])
  async brands(): Promise<Brand[]> {
    const brands = await Brand.find({});

    return brands;
  }

  @Mutation(() => Brand)
  async createBrand(@Arg("name") name: string): Promise<Brand> {
    return Brand.create({
      name,
    }).save();
  }
}
