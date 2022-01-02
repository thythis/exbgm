import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Brand } from "./Brand";
import { Tag } from "./Tag";

@ObjectType()
@Entity()
export class Art extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field()
  @Column()
  brandId: number;

  @Field()
  @Column({ array: true, nullable: true })
  titles: string;

  @Field()
  @Column({ type: "int", default: 0 })
  rating: number;

  @Field()
  @Column({ type: "int", default: 0 })
  likes: number;

  @Field()
  @ManyToOne(() => Brand, (brand) => brand.arts)
  brand: Brand;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.arts, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @Field()
  @Column({ type: "date", nullable: true })
  releasedAt: Date;
}
