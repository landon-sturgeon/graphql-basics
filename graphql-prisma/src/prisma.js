import { Prisma } from "prisma-binding";

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://localhost:4466",
});


const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId
    });

    if (!userExists) {
        throw new Error("User not found");
    };

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, "{ author { id name email posts { id title published } } }");

    return post.author
};

const updatePostForUser = async (postId, data) => {
    const exists = await prisma.exists.Post({id: postId});

    if (!exists) {
        throw new Error("Post not found");
    };

    const post = await prisma.mutation.updatePost({
        data: {
            ...data
        },
        where: {
            id: postId
        }
    }, "{ author { id name email posts { id title body published } } }");

    return post.author;
};

updatePostForUser("ck5ahr9in01rm0804nc5ewjgz", {
    body: "updating the post with a catch clause in the function to see if it updates",
    published: true
}).then((user) => {
    console.log(JSON.stringify(user, undefined, 2));
}).catch((error) => {
    console.log(error);
});

// prisma.mutation.updatePost({
//     data: {
//         body: "i've updated the body of this post"
//     },
//     where: {
//         id: "ck5b50yww01y40804mwxso6i2"
//     }
// }, " { id title body published }").then((data) => {
//     console.log(data);
//     return prisma.query.posts(null, "{ id title body published } ");
// }).then((data) => {
//     console.log(JSON.stringify(data,undefined, 4));
// });
