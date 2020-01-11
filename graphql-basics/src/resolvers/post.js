const Post = {
    author(parent, args, { db }, info) {
        return db.demo_users.find((user) => {
            return user.id === parent.author
        });
    },
    comments(parent, args, ctx, info) {
        return db.demo_comments.filter((comment) => {
            return comment.post === parent.id
        })
    }
};

export default Post;