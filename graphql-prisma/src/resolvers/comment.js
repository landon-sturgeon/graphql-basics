const Comment = {
    author(parent, args, { db }, info) {
        return db.demo_users.find((user) => {
            return user.id === parent.author
        });
    },
    post(parent, args, { db }, info) {
        return db.demo_posts.find((post) => {
            return post.id === parent.post
        });
    }
};

export default Comment;