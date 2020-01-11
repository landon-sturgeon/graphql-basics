import { GraphQLServer } from "graphql-yoga";

import uuidv4 from "uuid/v4";

// Scalar Types
// Strings, Booleans, Ints, Floats, ID

// Demo User Data
const demo_users = [{
    id: "1",
    name: "landon",
    email: "landon@example.com",
    age: 29
},
{
    id: "2",
    name: "sarah",
    email: "sarah@example.com"
},
{
    id: "3",
    name: "mike",
    email: "mike@example.com",
    age: 100
}];

const demo_posts = [
    {
        id: "1",
        title: "title1",
        body: "body1",
        published: false,
        author: "1"
    },
    {
        id: "2",
        title: "title3",
        body: "body3",
        published: false,
        author: "1"
    },
    {
        id: "3",
        title: "title3",
        body: "body3",
        published: false,
        author: "2"
    },
];

const demo_comments = [
    {
        id: "1",
        text: "comment 1",
        published: true,
        author: "1",
        post: "3"
    },
    {
        id: "2",
        text: "comment 2",
        published: false,
        author: "3",
        post: "1"
    },
    {
        id: "3",
        text: "comment 3",
        published: false,
        author: "3",
        post: "1"
    },
    {
        id: "4",
        text: "comment 4",
        published: true,
        author: "3",
        post: "3"
    },
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        published: Boolean!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]!
    }

    type Comment {
        id: ID!
        text: String!
        published: Boolean!
        author: User!
        post: Post!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return demo_users
            };

            return demo_users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return demo_posts;
            }
            return demo_posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return demo_comments;
            };

            return demo_comments.filter((comment) => {
                return comment.text.toLowerCase().includes(args.query.tolowercase());
            });
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = demo_users.some((user) => {
                return user.email === args.data.email
            });

            if (emailTaken) {
                throw new Error("Email taken.");
            }
            
            const user = {
                id: uuidv4(),
                ...args.data
            }

            demo_users.push(user);

            return user;
        },
        createPost(parent, args, cts, info) {
            const userExists = demo_users.some((user) => {
                return user.id === args.data.author
            });

            if (!userExists) {
                throw new Error("User not found");
            };

            const post = {
                id: uuidv4(),
                ...args.data
            };

            demo_posts.push(post);

            return post;
        },
        createComment(parent, args, cts, info) {
            const userExists = demo_users.some((user) => {
                return user.id === args.data.author;
            });
            console.log(userExists);
            const postExists = demo_posts.some((post) => {
                return post.id === args.data.post && post.published;
            });
            console.log(postExists);

            if (!userExists || !postExists) {
                throw new Error("Unable to find user and post");
            };

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            demo_comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return demo_users.find((user) => {
                return user.id === parent.author
            });
        },
        comments(parent, args, ctx, info) {
            return demo_comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return demo_posts.filter((post) => {
                return post.author === parent.id
            });
        },
        comments(parent, args, ctx, info) {
            return demo_comments.filter((comment) => {
                return comment.author === parent.id
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return demo_users.find((user) => {
                return user.id === parent.author
            });
        },
        post(parent, args, ctx, info) {
            return demo_posts.find((post) => {
                return post.id === parent.post
            });
        }
    }
}

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.start(() => {
    console.log("The server is up");
});