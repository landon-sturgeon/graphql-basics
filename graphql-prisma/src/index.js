import { GraphQLServer, PubSub } from "graphql-yoga";

import Mutation from "./resolvers/mutation";
import Query from "./resolvers/query";
import Subscription from "./resolvers/subscription";
import User from "./resolvers/user";
import Post from "./resolvers/post";
import Comment from "./resolvers/comment";
import prisma from "./prisma";

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Mutation,
        Query,
        Subscription,
        User,
        Post,
        Comment
    },
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    }
});

server.start(({port}) => {
    console.log(`The server is up on port ${port}`);
});