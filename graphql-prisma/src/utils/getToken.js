import jwt from "jsonwebtoken";

const getToken = (userId) => {
    return jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

export default getToken;