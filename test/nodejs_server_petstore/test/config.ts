///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
const packageInfo = require("../package.json");
var conf = require("nconf")
    .argv()
    .env({
        separator: "__",
        parseValues: true,
    });

conf.defaults({
    service_name: packageInfo.name,
    version: packageInfo.version,
    cookieSecret: "COOKIE_SECRET",
    cors: {
        origin: ["http://localhost:3000"],
    },
    datastores: {
        acl: {
            type: "mongodb",
            url: "mongodb://localhost:9999",
            database: "axr-test",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        mongodb: {
            type: "mongodb",
            url: "mongodb://localhost",
            database: "axr-test",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    // Specifies the role names that are considered to be trusted with administrative privileges.
    trusted_roles: ["admin"],
    // Settings pertaining to the signing and verification of authentication tokens
    auth: {
        // The default PassportJS authentication strategy to use
        strategy: "JWTStrategy",
        // The password to be used when verifying authentication tokens
        password: "MyPasswordIsSecure",
        options: {
            //"algorithm": "HS256",
            expiresIn: "7 days",
            audience: "mydomain.com",
            issuer: "api.mydomain.com",
        },
    },
    session: {
        secret: "SESSION_SECRET",
    },
});

export default conf;
