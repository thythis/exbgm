import "reflect-metadata";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createConnection } from "typeorm";
import path from "path";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";
import { Art } from "./entities/Art";
import { ArtResolver } from "./resolvers/art";
import { Brand } from "./entities/Brand";
import { BrandResolver } from "./resolvers/brand";
import { Tag } from "./entities/Tag";
import { TagResolver } from "./resolvers/tag";
import { createBrandLoader } from "./utils/createBrandLoader";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "exbgm",
    username: "postgres",
    password: "asdf123",
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    synchronize: true,
    entities: [User, Art, Brand, Tag],
  });
  // await conn.runMigrations();
  // await Art.delete({});

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        UserResolver,
        ArtResolver,
        BrandResolver,
        TagResolver,
      ],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: ({ req, res }) => ({
      req,
      res,
      brandLoader: createBrandLoader(),
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen("4000", () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
