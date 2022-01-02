import DataLoader from "dataloader";
import { Brand } from "../entities/Brand";

export const createBrandLoader = () =>
  new DataLoader<number, Brand>(async (brandIds) => {
    const brands = await Brand.findByIds(brandIds as number[]);
    const brandIdToBrand: Record<number, Brand> = {};
    brands.forEach((b) => {
      brandIdToBrand[b.id] = b;
    });

    return brandIds.map((id) => brandIdToBrand[id]);
  });
