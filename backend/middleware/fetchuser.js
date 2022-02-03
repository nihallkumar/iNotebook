const jwt = require("jsonwebtoken");

const jwt_secret = "nihalisagoodboy";

// Get user from jwt token and add id to req object 
const fetchuser = (req, res, next) => {

    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        const data = jwt.verify(token, jwt_secret)
        req.user = data.user;
        next();

    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchuser;
