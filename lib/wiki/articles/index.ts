import { gettingStarted } from "./getting-started";
import { fifoModel } from "./fifo-model";
import { batchMerging } from "./batch-merging";
import { productionProcess } from "./production-process";
import { disposalLogic } from "./disposal-logic";
import { rolesSecurity } from "./roles-security";
import { WikiArticle } from "../types";

export const WIKI_ARTICLES: WikiArticle[] = [
  gettingStarted,
  fifoModel,
  batchMerging,
  productionProcess,
  disposalLogic,
  rolesSecurity
];
