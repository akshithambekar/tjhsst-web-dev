const express = require("express");
const profile_router = express.Router();
const https = require("https");
const cookieSession = require("cookie-session");
const {AuthorizationCode} = require("simple-oauth2") ;
console.log("this router works");

profile_router.use(cookieSession({
    name: "profile",
    keys: ["piawgiuweauawehfpewhfwehfo", "wqp89oghvxzpoiygwoeiuhg"]
}));

const ion_client_id = "JvXWoPYIU3fInpTBI9PORbHcPCftniFZAvVGGLeK";
const ion_client_secret = "vW5g9siVqyh6T68BXnxpj8HEZyj950LRX0p0ey9kfyYU5wMjQqMMHdPI0rC6FfDdHcGn8yh98601ipgmLiCvvojF1qPOqED5XjQdJOh2DrBEiDxapTSCkpJzV24zZ1bN";
const client = new AuthorizationCode({
    client: {
        id: ion_client_id,
        secret: ion_client_secret,
    },
    auth: {
        tokenHost: "https://ion.tjhsst.edu/oauth",
        authorizePath: "https://ion.tjhsst.edu/oauth/authorize",
        tokenPath: "https://ion.tjhsst.edu/oauth/token/"
    }
});

const redirect_link = "https://user.tjhsst.edu/2024aambekar/logger_inner"; 
const authorizationURI = client.authorizeURL({
    scope: "read",
    redirect_uri: redirect_link
});

console.log(authorizationURI);

function check_auth(req, res, next) {
    console.log("checking auth");
    console.log(req.session);
    console.log(req.session.authenticated);
    if ("authenticated" in req.session) {
        console.log("authenticated");
        next();
    }
    else {
        console.log("not authenticated");
        res.render("unverified", {"login_link": authorizationURI});
    }
}

async function convert_to_token(req, res, next) {
    const options = {
        "code": req.query.code,
        "redirect_uri": redirect_link,
        "scope": "read"
    };
    try {
        const access_token = await client.getToken(options);
        res.locals.token = access_token.token;
        next();
    }
    catch (err) {
        console.log("Access Token Error");
        console.log(err.message);
        res.render("err");
    }
}

function get_profile(req, res, next) {
    console.log("getting profile");
    const access_token = req.session.token.access_token;
    const profile_url = "https://ion.tjhsst.edu/api/profile?format=json&access_token=" + access_token; 
    https.get(profile_url, (response) => { 
        let rawData = "";
        response.on("data", (chunk) => {
            rawData += chunk; 
        });
        response.on("end", () => {
            res.locals.profile = JSON.parse(rawData); 
            next();
        });

    }).on("error", (err) => {
        res.send("Error receiving data."); 
    });
}

function sql_promise(pool, sqlQuery, params) {
    console.log("in sql promise");
    return new Promise((resolve, reject) => {
        pool.query(sqlQuery, params, (error, results, fields) => {
            if (error) throw error;
            resolve(results);
        });
    });
}

profile_router.get("/nickname", async function (req, res) {
    let id = req.query.id;
    let nickname = req.query.nickname;
    let name = req.query.username;
    await sql_promise(res.app.locals.pool, "INSERT INTO users(id,name,nickname) VALUES (?,?,?);", [String(id), String(name), String(nickname)]);
    res.redirect("/2024aambekar/profile_page"); 
});

profile_router.get("/profile_page", [check_auth, get_profile], async function (req, res) { 
    const profile = res.locals.profile;
    const name = profile.display_name;
    let id = "";
    let img = "";
    let result = await sql_promise(res.app.locals.pool, "SELECT * FROM users", []);
    result = Object.assign(result);
    let out = {
        "name": result
    };
    out = Object.assign(out);
    let nickname = "false";
    let nick = "";
    for (let i = 0; i < out.name.length; i++) {
        let temp = out.name[i].name;
        if (String(temp) == name) {
            nickname = "true";
            nick = out.name[i].nickname;
        }
    }
    console.log(nickname);
    if (name !== null && name !== undefined && name.length > 1) {
        img = profile.picture;
        id = profile.ion_username;
    }
    res.render("profile", {"username": name, "picture": img, "id": id, "nickname_presence": nickname, "nick": nick}) ;
});

profile_router.get("/logger_inner", [convert_to_token], (req, res) => {
    if (req.session) {
        req.session.authenticated = true;
    }
    // req.session.authenticated = true;
    console.log(req.session.authenticated);
    req.session.token = res.locals.token;
    console.log("logged in");
    res.redirect("/2024aambekar/profile_page"); 
});

profile_router.get("/logout", (req, res) => {
    delete req.session.authenticated;
    res.redirect("/2024aambekar/profile_page");
});

module.exports = profile_router;