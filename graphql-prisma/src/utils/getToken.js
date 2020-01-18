import jwt from "jsonwebtoken";

const getToken = (userId) => {
    return jwt.sign(
        { userId: userId },
        "thisisasecret",
        { expiresIn: "1d" }
    );
};

export default getToken;