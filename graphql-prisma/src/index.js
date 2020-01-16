import { GraphQLServer, PubSub } from "graphql-yoga";

import Comment from "./resolvers/comment";
import Mutation from "./resolvers/mutation";
import Query from "./resolvers/query";
import Subscription from "./resolvers/subscription";
import prisma from "./prisma";

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Comment,
        Mutation,
        Query,
        Subscription
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