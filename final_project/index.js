const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const general_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configure session
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Middleware for authentication
app.use("/customer/auth/*", (req, res, next) => {
    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    next();
});

// Add routes
app.use("/customer", customer_routes);
app.use("/", general_routes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

