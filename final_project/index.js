const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains a valid access token
    if (!req.session || !req.session.token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // Verify the token
    jwt.verify(req.session.token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }

        // Attach the decoded user information to the request
        req.user = decoded;
        next(); // Proceed to the next middleware/route
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
