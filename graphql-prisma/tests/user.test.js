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

test("Should expose public author profiles", async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `;
    const response = await client.query({ query: getUsers });

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe("jenn");
}); 

test("Should expose only published posts", async () => {
    const getPosts = gql`
        query {
            posts {
                title
                body
                published
                author {
                    name
                    email
                }
            }
        }
    `;
    const response = await client.query({ query: getPosts });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].title).toBe("example post 1");
    expect(response.data.posts[0].body).toBe("prisma post body 1");
    expect(response.data.posts[0].published).toBe(true);
    expect(response.data.posts[0].author.name).toBe("jenn");
    expect(response.data.posts[0].author.email).toBe(null);
});

test("Should not login with bad credentials", async () => {
    const login = gql`
        mutation {
            login(
                data: {
                    email: "asdf@test.com",
                    password: "asdfasdfp"
                }
            ){
                token
            }
        }
    `;

    await expect(
        client.mutate({ mutation: login })
    ).rejects.toThrow();
});

test("Should not be able to signup with short password", async () => {
    const signup = gql`
        mutation {
            createUser(
                data: {
                    name: "landon",
                    email: "landon@example.com",
                    password: "123"
                }
            ){
                token
            }
        }
    `;
    await expect(
        client.mutate({ mutation: signup })
    ).rejects.toThrow();
});