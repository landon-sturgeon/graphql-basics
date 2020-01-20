import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

export const userOne = {
    input: {
        name: "jenn",
        email: "jenn@example.com",
        password: bcrypt.hashSync("Red098!@#$")
    },
    user: undefined,
    jwt: undefined
};

export const userTwo = {
    input: {
        name: "vikram",
        email: "vikram@example.com",
        password: bcrypt.hashSync("Red098!@#$")
    },
    user: undefined,
    jwt: undefined
};

export const postOne = {
    input: {
        title: "example post 1",
        "body": "prisma post body 1",
        "published": true,
    },
    post: undefined
};

export const postTwo = {
    input: {
        title: "example post 2",
        "body": "prisma post body 2",
        "published": false,
    },
    post: undefined
};

export const commentOne = {
    input: {
        text: "comment one",
        published: true,
    },
    comment: undefined
};

export const commentTwo = {
    input: {
        text: "comment two",
        published: true,
    },
    comment: undefined
};

export const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);
    
    // create post one
    postOne.post = await prisma.mutation.createPost({
        data:{
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });

    // create post two
    postTwo.post = await prisma.mutation.createPost({
        data:{
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });

    // create a comment authored by userTwo onto postOne (the published post)
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    });

    // create a comment authored by userOne onto postOne (the published post)
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    });
};