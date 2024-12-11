///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
const packageInfo = require("../package.json");
const conf = require("nconf")
    .argv()
    .env({
        separator: "__",
        parseValues: true,
    });

conf.defaults({
    service_name: packageInfo.name,
    version: packageInfo.version,
    cookie_secret: "COOKIE_SECRET",
    cors: {
        origin: ["http://localhost:3000"],
    },
    datastores: {
        acl: {
            type: "mongodb",
            host: "localhost",
            database: "acl",
            synchronize: true,
        },
        cache: {
            type: "redis",
            url: "redis://localhost:6379",
        },
    {{#each datastores}}
        {{this.name}}: {
            type: "{{this.type}}",
            host: "localhost",
            database: "{{service_name}}",
            synchronize: true,
        },
    {{/each}}
    },
    // Specifies the role names that are considered to be trusted with administrative privileges.
    trusted_roles: ["admin"],
    // Settings pertaining to the signing and verification of authentication tokens
    auth: {
        // The default PassportJS authentication strategy to use
        strategy: "passportjs.AXRStrategy",
        // The password to be used when signing and verifying authentication tokens
        secret: "MyPasswordIsSecure",
        options: {
            // "algorithm": "HS256",
            expiresIn: "1 hour",
            audience: "mydomain.com",
            issuer: "api.mydomain.com",
        },
    },
    session: {
        secret: "SESSION_SECRET",
    },
});

export default conf;
