import { GraphQLServer } from "graphql-yoga";

import db from "./db";
import Comment from "./resolvers/comment";
import Mutation from "./resolvers/mutation";
import Post from "./resolvers/post";
import Query from "./resolvers/query";
import User from "./resolvers/user";

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Comment,
        Mutation,
        Post,
        Query,
        User
    },
    context: {
        db: db
    }
});

server.start(() => {
    console.log("The server is up");
});