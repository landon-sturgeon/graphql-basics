import getUserId from "../utils/getUserId";

const User = {
    email(parent, args, { request }, info) {
        const userId = getUserId(request, false);
        console.log(userId);

        if (userId && userId === parent.id) {
            return parent.email;
        } else {
            return null;
        };
    }
};

export default User;