import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";
import Comment from "./resolvers/comment";
import Mutation from "./resolvers/mutation";
import Post from "./resolvers/post";
import Query from "./resolvers/query";
import User from "./resolvers/user";
import Subscription from "./resolvers/subscription";

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Comment,
        Mutation,
        Post,
        Query,
        User,
        Subscription
    },
    context: {
        db: db,
        pubsub: pubsub
    }
});

server.start(() => {
    console.log("The server is up");
});