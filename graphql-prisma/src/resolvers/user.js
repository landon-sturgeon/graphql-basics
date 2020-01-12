const User = {
    posts(parent, args, { db }, info) {
        return db.demo_posts.filter((post) => {
            return post.author === parent.id
        });
    },
    comments(parent, args, { db }, info) {
        return db.demo_comments.filter((comment) => {
            return comment.author === parent.id
        });
    }
};

export default User;