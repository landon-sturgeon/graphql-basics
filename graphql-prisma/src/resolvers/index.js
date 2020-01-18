import { extractFragmentReplacements } from "prisma-binding";

import Mutation from "./mutation";
import Query from "./query";
import Subscription from "./subscription";
import User from "./user";
import Post from "./post";
import Comment from "./comment";

export const resolvers = {
    Mutation,
    Query,
    User,
    Post,
    Comment,
    Subscription
};

export const fragmentReplacements = extractFragmentReplacements(resolvers);