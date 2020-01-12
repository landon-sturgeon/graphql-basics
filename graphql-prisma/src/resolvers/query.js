const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.demo_users
        };

        return db.demo_users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.demo_posts;
        }
        return db.demo_posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
            return isTitleMatch || isBodyMatch;
        });
    },
    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.demo_comments;
        };

        return db.demo_comments.filter((comment) => {
            return comment.text.toLowerCase().includes(args.query.tolowercase());
        });
    },
    me() {
        return {
            id: "092",
            name: "Landon",
            email: "landon@example.com",
        };
    }
};

