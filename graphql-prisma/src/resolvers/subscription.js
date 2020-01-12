const Subscription = {
    comment: {
        subscribe(parent, { id }, { db, pubsub }, info) {
            const post = db.demo_posts.find((post) => {
                return post.id === id && post.published;
            });

            if (!post) {
                throw new Error("Post not found");
            };

            return pubsub.asyncIterator(`comment ${id}`);
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator(`post`);
        }
    }
};

export default Subscription;