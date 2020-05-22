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
            url: "mongodb://localhost",
            database: "acl",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            synchronize: true,
        },
        // Uncomment the following to enable 2nd level caching support.
        // Only entity models with the @Cache decorator will be cached.
        //cache: {
        //    type: "redis",
        //    url: "redis://localhost:6379",
        //},
    {{#each datastores}}
        {{this.name}}: {
            type: "{{this.type}}",
            url: "{{this.url}}",
            database: "{{service_name}}",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            synchronize: true,
        },
    {{/each}}
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
    jobs: {
        defaultSchedule: "* * * * * *",
        MetricsCollector: {
            schedule: "*/5 * * * * *",
        },
    },
    session: {
        secret: "SESSION_SECRET",
    },
});

export default conf;
