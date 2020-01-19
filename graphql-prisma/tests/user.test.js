import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import bcrypt from "bcryptjs";

import prisma from "../src/prisma";

const client = new ApolloBoost({
    uri: "http://localhost:4000"
});

beforeEach(async () => {
    await prisma.mutation.deleteManyUsers();
    const newUser = await prisma.mutation.createUser({
        data: {
            name: "jenn",
            email: "jenn@example.com",
            password: bcrypt.hashSync("Red098!@#$")
        }
    });
    
    await prisma.mutation.createPost({
        data:{
            title: "example post 1",
            "body": "prisma post body 1",
            "published": true,
            author: {
                connect: {
                    id: newUser.id
                }
            }
        }
    });

    await prisma.mutation.createPost({
        data:{
            title: "example post 2",
            "body": "prisma post body 2",
            "published": false,
            author: {
                connect: {
                    id: newUser.id
                }
            }
        }
    });
});

test("Should create a new user", async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "landon"
                    email: "landon@test.com"
                    password: "mypass123"
                }
            ){
                token,
                user {
                    id
                }
            }
        }
    `;

    const response = await client.mutate({
        mutation: createUser
    });

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });

    expect(userExists).toBe(true);
});