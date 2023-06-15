// const express = require("express");
// const cookies_router = express.Router();
// const cookies_parser = require("cookie-parser");
// const cookie_session = require("cookie-session");

// cookies_router.use(cookies_parser());

// // cookies_router.use(cookie_session({
// //     name: 'tmp_visits',
// //     keys: ["key1", "key23"],
// //     maxAge: 84600000
// // }));

// cookies_router.use((req, res, next) => {
//     if (req.session.views) {
//         req.session.views = parseInt(req.session.views) + 1;
//     } else {
//         req.session.views = 1;
//     }
//     next();
// });

// cookies_router.get("/cookie_page", (req, res) => {
//     const max_visits = 5;
//     if (req.session.views > max_visits) {
//         res.render("blocked_page");
//     } else {
//         res.render("cookie_page", {visited: req.session.views});
//     }
// });


// module.exports = cookies_router;