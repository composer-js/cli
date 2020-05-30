///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import * as request from "supertest";
import { Server, ConnectionManager } from "@composer-js/service-core";
import { JWTUtils, Logger } from "@composer-js/core";

import { MongoMemoryServer } from "mongodb-memory-server";
import AuthToken from "../src/models/AuthToken";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});

jest.setTimeout(30000);

describe("Auth Tests", () => {
    const server: Server = new Server(config, undefined, "./src");
    const baseUrl = "/user/login";

    const admin: any = {
        uid: uuid.v4(),
        roles: config.get("trusted_roles"),
    };
    const adminToken = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
    };
    const authToken = JWTUtils.createToken(config.get("auth"), user);

    beforeAll(async () => {
        await mongod.start();
        await server.start();


        // TODO
    });
    
    afterAll(async () => {
        await server.stop();
        await mongod.stop();
        // TODO
    });

    beforeEach(async () => {
    });


    it("Can make login request.", async () => {

        const result = await request(server.getApplication())
            .get(baseUrl)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        // TODO Validate result body
        
    });

    it("Can make logout request.", async () => {
        const url = baseUrl + "/user/logout";

        const result = await request(server.getApplication())
            .get(url)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);

    });
});