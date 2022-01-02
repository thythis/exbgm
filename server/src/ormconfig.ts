import path from "path";
import { ConnectionOptions } from "typeorm";
import { User } from "./entities/User";

export default {
  type: "postgres",
  database: "exbgm",
  username: "postgres",
  password: "asdf123",
  logging: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  synchronize: true,
  entities: [User],
} as ConnectionOptions;
