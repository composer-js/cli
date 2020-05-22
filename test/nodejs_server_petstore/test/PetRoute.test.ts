///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import * as request from "supertest";
import { Server, ConnectionManager, ACLRecord } from "@composer-js/service-core";
import { JWTUtils, Logger } from "@composer-js/core";
import { MongoRepository, Connection } from "typeorm";
import { MongoMemoryServer } from "mongodb-memory-server";
import Pet from "../src/models/Pet";
import Category from "../src/models/Category";
import Tag from "../src/models/Tag";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});

jest.setTimeout(30000);

describe("Pet Tests", () => {
    const server: Server = new Server(config, undefined, "./src");
    const baseUrl = "/pet";

    const admin: any = {
        uid: uuid.v4(),
        roles: config.get("trusted_roles"),
    };
    const adminToken = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
    };
    const authToken = JWTUtils.createToken(config.get("auth"), user);
    let repo: MongoRepository<Pet>;
    let aclRepo: MongoRepository<any>;

    const createPet = async function(/** TODO Add initializers */): Promise<Pet> {
        const obj: Pet = new Pet({
            // TODO Add default test property values
            id: 0,
            category: new Category(),
            name: "",
            photoUrls: [],
            tags: [],
            status: "",
        });
        
        const result: Pet = await repo.save(obj);

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
            parentUid: "Pet"
        };
        await aclRepo.save(aclRepo.create(acl));

        return result;
    }

    const createPets = async function(num: number, /** TODO Add initializers */): Promise<Pet[]> {
        const results: Pet[] = [];

        for (let i = 0; i < num; i++) {
            results.push(await createPet());
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
            repo = conn.getMongoRepository("Pet");
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


    it("Can make find request.", async () => {

        const result = await request(server.getApplication())
            .get(baseUrl);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        // TODO Validate result body
        
    });

    it("Can make add request.", async () => {
        const obj: Pet = new Pet({
            // TODO Provide initial values
        });
        
        const result = await request(server.getApplication())
            .post(baseUrl)
            .set("Authorization", "jwt " + adminToken)
            .send(obj);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        // TODO Validate result body
        
    });

    it("Can make truncate request.", async () => {
        const objs: Pet[] = await createPets(5);

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
        const obj: Pet = await createPet();
                const url = baseUrl + "/:id";

        const result = await request(server.getApplication())
            .get(url);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body.id).toEqual(obj.id);
        expect(result.body.category).toEqual(obj.category);
        expect(result.body.name).toEqual(obj.name);
        expect(result.body.photoUrls).toEqual(obj.photoUrls);
        expect(result.body.tags).toEqual(obj.tags);
        expect(result.body.status).toEqual(obj.status);

    });

    it("Can make update request.", async () => {
        const obj: Pet = await createPet();
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
        expect(result.body.category).toEqual(obj.category);
        expect(result.body.name).toEqual(obj.name);
        expect(result.body.photoUrls).toEqual(obj.photoUrls);
        expect(result.body.tags).toEqual(obj.tags);
        expect(result.body.status).toEqual(obj.status);

        // Validate the contents were stored correctly
        const existing: Pet | undefined = await repo.findOne({uid: obj.uid});
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.id).toEqual(obj.id);
            expect(existing.category).toEqual(obj.category);
            expect(existing.name).toEqual(obj.name);
            expect(existing.photoUrls).toEqual(obj.photoUrls);
            expect(existing.tags).toEqual(obj.tags);
            expect(existing.status).toEqual(obj.status);
        }
    });

    it("Can make delete request.", async () => {
        const obj: Pet = await createPet();
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
});