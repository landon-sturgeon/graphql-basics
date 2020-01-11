import uuidv4 from "uuid/v4";

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.demo_users.some((user) => {
            return user.email === args.data.email
        });

        if (emailTaken) {
            throw new Error("Email taken.");
        };
        
        const user = {
            id: uuidv4(),
            ...args.data
        };

        db.demo_users.push(user);

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.demo_users.findIndex((user) => {
            return user.id === args.id;
        });

        if (userIndex === -1) {
            throw new Error("User does not exist");
        };

        const deletedUsers = db.demo_users.splice(userIndex, 1);

        db.demo_posts = db.demo_posts.filter((post) => {
            const match = post.author === args.id;

            if (match) {
                db.demo_comments = db.demo_comments.filter((comment) => {
                    return comment.post != post.id;
                });
            };

            return !match;
        });

        db.demo_comments = demo_comments.filter((comment) => {
            return comment.author !== args.id;
        });

        return deletedUsers[0];
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.demo_users.find((user) => {
            return user.id === id;
        });

        if (!user) {
            throw new Error("User not found");
        };

        if (typeof data.email === "string") {
            const emailTaken = db.demo_users.some((user) => {
                return user.email === data.email;
            });

            if (emailTaken) {
                throw new Error("Email taken");
            };

            user.email = data.email;
        };

        if (typeof data.name === "string") {
            user.name = data.name;
        };

        if (typeof data.age !== "undefined") {
            user.age = data.age;
        };

        return user;
    },
    createPost(parent, args, { db }, info) {
        const userExists = db.demo_users.some((user) => {
            return user.id === args.data.author
        });

        if (!userExists) {
            throw new Error("User not found");
        };

        const post = {
            id: uuidv4(),
            ...args.data
        };

        db.demo_posts.push(post);

        return post;
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.demo_posts.findIndex((post) => {
            return post.id === args.id;
        });

        if (postIndex === -1) {
            throw new Error("Post not found");
        };

        const deletedPosts = db.demo_posts.splice(postIndex, 1);

        db.demo_comments = db.demo_comments.filter((comment) => {
            return comment.post !== args.id;
        });

        return deletedPosts[0];
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args;
        const post = db.demo_posts.find((post) => {
            return post.id === id;
        });

        if (!post) {
            throw new Error("Post not found");
        };

        if (typeof data.title === "string") {
            post.title = data.title;
        };

        if (typeof data.body === "string") {
            post.body = data.body;
        };

        if (typeof data.published === "boolean") {
            post.published = data.published;
        };

        return post;
    },
    createComment(parent, args, { db }, info) {
        const userExists = db.demo_users.some((user) => {
            return user.id === args.data.author;
        });
        const postExists = db.demo_posts.some((post) => {
            return post.id === args.data.post && post.published;
        });

        if (!userExists || !postExists) {
            throw new Error("Unable to find user and post");
        };

        const comment = {
            id: uuidv4(),
            ...args.data
        };

        db.demo_comments.push(comment);

        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.demo_comments.findIndex((comment) => {
            return comment.id === args.id;
        });

        if (commentIndex === -1) {
            throw new Error("Comment not found");
        };

        const deletedComments = db.demo_comments.splice(commentIndex, 1);

        return deletedComments[0];
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args;

        const comment = db.demo_comments.find((comment) => {
            return comment.id === id;
        });
        
        if (!comment) {
            throw new Error("Comment not found");
        };

        if (typeof data.text === "string") {
            comment.text = data.text;
        };
        if (typeof data.published === "boolean") {
            comment.published = data.published;
        };

        return comment;
    }
};

export default Mutation;