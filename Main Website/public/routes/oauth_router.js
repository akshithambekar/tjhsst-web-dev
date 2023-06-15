// const express = require("express");
// const oauth_router = express.Router();
// const {AuthorizationCode} = require("simple-oauth2");
// oauth_router.use(express.json());

// const ion_client_id = 'JvXWoPYIU3fInpTBI9PORbHcPCftniFZAvVGGLeK';
// const ion_client_secret = 'vW5g9siVqyh6T68BXnxpj8HEZyj950LRX0p0ey9kfyYU5wMjQqMMHdPI0rC6FfDdHcGn8yh98601ipgmLiCvvojF1qPOqED5XjQdJOh2DrBEiDxapTSCkpJzV24zZ1bN';
// const ion_redirect_uri = "https://user.tjhsst.edu/2024aambekar/logger_inner";

// const oauth_params = {
//     client: {
//         id: ion_client_id,
//         secret: ion_client_secret
//     },
//     auth: {
//         tokenHost: 'https://ion.tjhsst.edu/oauth/',
//         authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
//         tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
//     }
// };

// const client = new AuthorizationCode(oauth_params);

// const authorizationURI = client.authorizeURL({
//     scope: "read",
//     redirect_uri: ion_redirect_uri
// });

// oauth_router.get("/first", (req, res) => {
//     res.render("unverified", {"login_link": authorizationURI});
// });

// oauth_router.get("/logger_inner", async function(req, res) {
//     const {code} = req.query;
//     const options = {
//         "code": code,
//         "redirect_uri": ion_redirect_uri,
//         "scope": "read"
//     };
//     let token;
//     try {
//         token = await client.getToken(options);
//     } catch (err) {
//         console.log("Access Token Error", err.message);
//         res.send(502);
//     }

//     const access_token = token.token.access_token;
//     console.log(token);
//     const authenticated_link = `https://ion.tjhsst.edu/api/profile?format=json&access_token=${access_token}`;
//     console.log(authenticated_link);
//     res.render("login_success");
// });

// module.exports = oauth_router;