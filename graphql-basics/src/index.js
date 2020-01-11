import { GraphQLServer } from "graphql-yoga";

import uuidv4 from "uuid/v4";

// Scalar Types
// Strings, Booleans, Ints, Floats, ID

// Demo User Data
let demo_users = [{
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

let demo_posts = [
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

let demo_comments = [
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
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id: ID!): Comment!
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
            };
            
            const user = {
                id: uuidv4(),
                ...args.data
            };

            demo_users.push(user);

            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = demo_users.findIndex((user) => {
                return user.id === args.id;
            });

            if (userIndex === -1) {
                throw new Error("User does not exist");
            };

            const deletedUsers = demo_users.splice(userIndex, 1);

            demo_posts = demo_posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    demo_comments = demo_comments.filter((comment) => {
                        return comment.post != post.id;
                    });
                };

                return !match;
            });

            demo_comments = demo_comments.filter((comment) => {
                return comment.author !== args.id;
            });

            return deletedUsers[0];
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
        deletePost(parent, args, cts, info) {
            const postIndex = demo_posts.findIndex((post) => {
                return post.id === args.id;
            });

            if (postIndex === -1) {
                throw new Error("Post not found");
            };

            const deletedPosts = demo_posts.splice(postIndex, 1);

            demo_comments = demo_comments.filter((comment) => {
                return comment.post !== args.id;
            });

            return deletedPosts[0];
        },
        createComment(parent, args, cts, info) {
            const userExists = demo_users.some((user) => {
                return user.id === args.data.author;
            });
            const postExists = demo_posts.some((post) => {
                return post.id === args.data.post && post.published;
            });

            if (!userExists || !postExists) {
                throw new Error("Unable to find user and post");
            };

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            demo_comments.push(comment);

            return comment;
        },
        deleteComment(parent, args, cts, info) {
            const commentIndex = demo_comments.findIndex((comment) => {
                return comment.id === args.id;
            });

            if (commentIndex === -1) {
                throw new Error("Comment not found");
            };

            const deletedComments = demo_comments.splice(commentIndex, 1);

            return deletedComments[0];
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