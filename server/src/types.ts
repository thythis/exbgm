import { Request, Response } from "express";
import { createBrandLoader } from "./utils/createBrandLoader";

export type MyContext = {
  req: Request;
  res: Response;
  brandLoader: ReturnType<typeof createBrandLoader>;
};
