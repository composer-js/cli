///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import * as request from "supertest";
import { Server, ConnectionManager, ACLRecord } from "@composer-js/service-core";
import { JWTUtils, Logger } from "@composer-js/core";
import { MongoRepository, Connection } from "typeorm";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/User";
import Count from "../src/models/Count";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});

jest.setTimeout(30000);

describe("User Tests", () => {
    const server: Server = new Server(config, undefined, "./src");
    const baseUrl = "/user";

    const admin: any = {
        uid: uuid.v4(),
        roles: config.get("trusted_roles"),
    };
    const adminToken = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
    };
    const authToken = JWTUtils.createToken(config.get("auth"), user);
    let repo: MongoRepository<User>;
    let aclRepo: MongoRepository<any>;

    const createUser = async function(/** TODO Add initializers */): Promise<User> {
        const obj: User = new User({
            // TODO Add default test property values
            id: 0,
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            userStatus: 0,
        });
        
        const result: User = await repo.save(obj);

        const records: ACLRecord[] = [];

        // Owner has CRUD access
        records.push({
            userOrRoleId: user.uid,
            create: true,
            read: true,
            update: true,
            delete: true,
            special: false,
            full: false,
        });

        // Everyone has read-only access
        records.push({
            userOrRoleId: ".*",
            create: false,
            read: true,
            update: false,
            delete: false,
            special: false,
            full: false,
        });

        const acl: any = {
            uid: result.uid,
            dateCreated: new Date(),
            dateModified: new Date(),
            version: 0,
            records,
            parentUid: "User"
        };
        await aclRepo.save(aclRepo.create(acl));

        return result;
    }

    const createUsers = async function(num: number, /** TODO Add initializers */): Promise<User[]> {
        const results: User[] = [];

        for (let i = 0; i < num; i++) {
            results.push(await createUser());
        }

        return results;
    }

    beforeAll(async () => {
        await mongod.start();
        await server.start();

        let conn: any = ConnectionManager.connections.get("acl");
        if (conn instanceof Connection) {
            aclRepo = conn.getMongoRepository("AccessControlListMongo");
        }
        conn = ConnectionManager.connections.get("mongodb");
        if (conn instanceof Connection) {
            repo = conn.getMongoRepository("User");
        } else {
            throw new Error("Could not find mongodb connection");
        }

        // TODO
    });
    
    afterAll(async () => {
        try {
            await aclRepo.clear();
        } catch (err) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message != "ns not found") {
                throw err;
            }
        }
        
        await server.stop();
        await mongod.stop();
        // TODO
    });

    beforeEach(async () => {
        try {
            await repo.clear();
        } catch (err) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message != "ns not found") {
                throw err;
            }
        }
    });


    it("Can make findAll request.", async () => {
        const objs: User[] = await createUsers(5);

        const result = await request(server.getApplication())
            .get(baseUrl)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body).toHaveLength(objs.length);
        // TODO Validate results further?

    });

    it("Can make create request.", async () => {
        const obj: User = new User({
            // TODO Provide better test values
            id: 0,
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            userStatus: 0,
        });

        const result = await request(server.getApplication())
            .post(baseUrl)
            .set("Authorization", "jwt " + adminToken)
            .send(obj);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body.id).toEqual(obj.id);
        expect(result.body.username).toEqual(obj.username);
        expect(result.body.firstName).toEqual(obj.firstName);
        expect(result.body.lastName).toEqual(obj.lastName);
        expect(result.body.email).toEqual(obj.email);
        expect(result.body.password).toEqual(obj.password);
        expect(result.body.phone).toEqual(obj.phone);
        expect(result.body.userStatus).toEqual(obj.userStatus);

        // Validate the contents were stored correctly
        const existing: User | undefined = await repo.findOne({uid: obj.uid});
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.id).toEqual(obj.id);
            expect(existing.username).toEqual(obj.username);
            expect(existing.firstName).toEqual(obj.firstName);
            expect(existing.lastName).toEqual(obj.lastName);
            expect(existing.email).toEqual(obj.email);
            expect(existing.password).toEqual(obj.password);
            expect(existing.phone).toEqual(obj.phone);
            expect(existing.userStatus).toEqual(obj.userStatus);
        }
    });

    it("Can make truncate request.", async () => {
        const objs: User[] = await createUsers(5);

        const result = await request(server.getApplication())
            .delete(baseUrl)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);

        // Validate the contents were removed
        const count: number = await repo.count();
        expect(count).toBe(0);
            });

    it("Can make findById request.", async () => {
        const obj: User = await createUser();
                const url = baseUrl + "/:id";

        const result = await request(server.getApplication())
            .get(url)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body.id).toEqual(obj.id);
        expect(result.body.username).toEqual(obj.username);
        expect(result.body.firstName).toEqual(obj.firstName);
        expect(result.body.lastName).toEqual(obj.lastName);
        expect(result.body.email).toEqual(obj.email);
        expect(result.body.password).toEqual(obj.password);
        expect(result.body.phone).toEqual(obj.phone);
        expect(result.body.userStatus).toEqual(obj.userStatus);

    });

    it("Can make update request.", async () => {
        const obj: User = await createUser();
                const url = baseUrl + "/:id";
        // TODO Add update modifications
        //obj.variable = newvalue;

        const result = await request(server.getApplication())
            .put(url)
            .set("Authorization", "jwt " + adminToken)
            .send(obj);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body.id).toEqual(obj.id);
        expect(result.body.username).toEqual(obj.username);
        expect(result.body.firstName).toEqual(obj.firstName);
        expect(result.body.lastName).toEqual(obj.lastName);
        expect(result.body.email).toEqual(obj.email);
        expect(result.body.password).toEqual(obj.password);
        expect(result.body.phone).toEqual(obj.phone);
        expect(result.body.userStatus).toEqual(obj.userStatus);

        // Validate the contents were stored correctly
        const existing: User | undefined = await repo.findOne({uid: obj.uid});
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.id).toEqual(obj.id);
            expect(existing.username).toEqual(obj.username);
            expect(existing.firstName).toEqual(obj.firstName);
            expect(existing.lastName).toEqual(obj.lastName);
            expect(existing.email).toEqual(obj.email);
            expect(existing.password).toEqual(obj.password);
            expect(existing.phone).toEqual(obj.phone);
            expect(existing.userStatus).toEqual(obj.userStatus);
        }
    });

    it("Can make delete request.", async () => {
        const obj: User = await createUser();
                const url = baseUrl + "/:id";

        const result = await request(server.getApplication())
            .delete(url)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);

        // Validate the contents were removed
        const count: number = await repo.count({uid: obj.uid});
        expect(count).toBe(0);
    });

    it("Can make count request.", async () => {
        const objs: User[] = await createUsers(5);
        const url = baseUrl + "/count";

        const result = await request(server.getApplication())
            .get(url);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body.count).toBe(objs.length);

    });
});