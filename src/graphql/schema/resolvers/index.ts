import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";

const resolversArray = loadFilesSync(`${__dirname}/**/*.ts`);

export default mergeResolvers(resolversArray);