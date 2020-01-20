import "cross-fetch/polyfill";

import { getPosts, getMyPosts, 
    updatePost, createPost, deletePost
} from "./utils/operations";
import getClient from "./utils/getClient";
import prisma from "../src/prisma";
import { seedDatabase, userOne, postOne, postTwo } from "./utils/seedDatabase";

const client = getClient();

beforeEach(seedDatabase);

test("Should expose only published posts", async () => {
    const response = await client.query({ query: getPosts });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test("Should return posts belonging to logged in user", async () => {
    const client = getClient(userOne.jwt);

    const { data } = await client.query({ query: getMyPosts });

    expect(data.myPosts.length).toBe(2);
});

test("Should be able to update own post", async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    };

    const { data } = await client.mutate({ 
        mutation: updatePost,
        variables: variables
    });
    const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });

    expect(data.updatePost.published).toBe(false);
    expect(exists).toBe(true);
});

test("Should create post with correct field values", async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        data: {
            title: "test correct post",
            body: "test correct post body",
            published: true
        }
    }; 

    const { data } = await client.mutate({ 
        mutation: createPost,
        variables: variables
    });
    
    expect(data.createPost.title).toBe("test correct post");
    expect(data.createPost.body).toBe("test correct post body");
    expect(data.createPost.published).toBe(true);
});

test("Should delete post", async() => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postTwo.post.id
    }; 
    await client.mutate({ 
        mutation: deletePost, variables: variables 
    });
    const exists = await prisma.exists.Post({ id: postTwo.post.id });

    expect(exists).toBe(false);
});