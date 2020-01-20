import "cross-fetch/polyfill";

import { deleteComment } from './utils/operations';
import getClient from "./utils/getClient";
import { 
    seedDatabase, userOne, 
    commentOne, commentTwo 
} from "./utils/seedDatabase";
import prisma from "../src/prisma";

beforeEach(seedDatabase);

test("Should delete own comment", async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentTwo.comment.id
    };
    await client.mutate({
        mutation: deleteComment,
        variables: variables
    });
    const exists = await prisma.exists.Comment({ id: commentTwo.comment.id });
    expect(exists).toBe(false);
});

test("Should not delete other users comment", async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentOne.comment.id
    };
    
    expect(client.mutate(
        {
            mutation: deleteComment,
            variables: variables
        })
    ).rejects.toThrow();
})