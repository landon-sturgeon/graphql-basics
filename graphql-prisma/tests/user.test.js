import "cross-fetch/polyfill";

import {
    createUser, getUsers,
    login, getProfile
} from './utils/operations';
import getClient from "./utils/getClient";
import { seedDatabase, userOne } from "./utils/seedDatabase";
import prisma from "../src/prisma";

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user", async () => {
    const variables = {
        data: {
            name: "landon",
            email: "landon@example.com",
            password: "mypass123"
        }
    };

    const response = await client.mutate({
        mutation: createUser,
        variables: variables
    });

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });

    expect(userExists).toBe(true);
});

test("Should expose public author profiles", async () => {

    const response = await client.query({ query: getUsers });

    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe("jenn");
}); 

test("Should not login with bad credentials", async () => {
    const variables = {
        data: {
            email: "asdf@test.com",
            password: "asdfasdfp"
        }
    };

    await expect(
        client.mutate({ 
            mutation: login, 
            variables: variables 
        })
    ).rejects.toThrow();
});

test("Should not be able to signup with short password", async () => {
    const variables = {
        data: {
            name: "landon",
            email: "landon@example.com",
            password: "123"
        }
    };

    await expect(
        client.mutate({ 
            mutation: createUser,
            variables: variables
        })
    ).rejects.toThrow();
});

test("Should fetch user profile", async () => {
    const client = getClient(userOne.jwt);

    const { data } = await client.query({ query: getProfile });

    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});