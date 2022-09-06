const jwt = require('jsonwebtoken');
const JWT_SECRET = 'fAIZsALIMsHAIKH';

const fetchuser = (req, res, next) => {
    // Get the user from jwt token and append the id to req object

    const token = req.header('auth-token');
    if (!token) {
        res.status(401).json({ error: "Use Valid Token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Use Valid Token" });
    }
}
module.exports = fetchuser;