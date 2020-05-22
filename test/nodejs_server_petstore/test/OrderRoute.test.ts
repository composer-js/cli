///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import * as request from "supertest";
import { Server, ConnectionManager, ACLRecord } from "@composer-js/service-core";
import { JWTUtils, Logger } from "@composer-js/core";
import { MongoRepository, Connection } from "typeorm";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../src/models/Order";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});

jest.setTimeout(30000);

describe("Order Tests", () => {
    const server: Server = new Server(config, undefined, "./src");
    const baseUrl = "/store/order";

    const admin: any = {
        uid: uuid.v4(),
        roles: config.get("trusted_roles"),
    };
    const adminToken = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
    };
    const authToken = JWTUtils.createToken(config.get("auth"), user);
    let repo: MongoRepository<Order>;
    let aclRepo: MongoRepository<any>;

    const createOrder = async function(/** TODO Add initializers */): Promise<Order> {
        const obj: Order = new Order({
            // TODO Add default test property values
            id: 0,
            petId: 0,
            quantity: 0,
            shipDate: new Date(),
            status: "",
            complete: false,
        });
        
        const result: Order = await repo.save(obj);

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
            parentUid: "Order"
        };
        await aclRepo.save(aclRepo.create(acl));

        return result;
    }

    const createOrders = async function(num: number, /** TODO Add initializers */): Promise<Order[]> {
        const results: Order[] = [];

        for (let i = 0; i < num; i++) {
            results.push(await createOrder());
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
            repo = conn.getMongoRepository("Order");
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
        const objs: Order[] = await createOrders(5);

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
        const obj: Order = new Order({
            // TODO Provide better test values
            id: 0,
            petId: 0,
            quantity: 0,
            shipDate: new Date(),
            status: "",
            complete: false,
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
        expect(result.body.petId).toEqual(obj.petId);
        expect(result.body.quantity).toEqual(obj.quantity);
        expect(result.body.shipDate).toEqual(obj.shipDate);
        expect(result.body.status).toEqual(obj.status);
        expect(result.body.complete).toEqual(obj.complete);

        // Validate the contents were stored correctly
        const existing: Order | undefined = await repo.findOne({uid: obj.uid});
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.id).toEqual(obj.id);
            expect(existing.petId).toEqual(obj.petId);
            expect(existing.quantity).toEqual(obj.quantity);
            expect(existing.shipDate).toEqual(obj.shipDate);
            expect(existing.status).toEqual(obj.status);
            expect(existing.complete).toEqual(obj.complete);
        }
    });

    it("Can make findById request.", async () => {
        const obj: Order = await createOrder();
                const url = baseUrl + "/:id";

        const result = await request(server.getApplication())
            .get(url)
            .set("Authorization", "jwt " + adminToken);

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.body).toBeDefined();
        expect(result.body.id).toEqual(obj.id);
        expect(result.body.petId).toEqual(obj.petId);
        expect(result.body.quantity).toEqual(obj.quantity);
        expect(result.body.shipDate).toEqual(obj.shipDate);
        expect(result.body.status).toEqual(obj.status);
        expect(result.body.complete).toEqual(obj.complete);

    });

    it("Can make update request.", async () => {
        const obj: Order = await createOrder();
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
        expect(result.body.petId).toEqual(obj.petId);
        expect(result.body.quantity).toEqual(obj.quantity);
        expect(result.body.shipDate).toEqual(obj.shipDate);
        expect(result.body.status).toEqual(obj.status);
        expect(result.body.complete).toEqual(obj.complete);

        // Validate the contents were stored correctly
        const existing: Order | undefined = await repo.findOne({uid: obj.uid});
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.id).toEqual(obj.id);
            expect(existing.petId).toEqual(obj.petId);
            expect(existing.quantity).toEqual(obj.quantity);
            expect(existing.shipDate).toEqual(obj.shipDate);
            expect(existing.status).toEqual(obj.status);
            expect(existing.complete).toEqual(obj.complete);
        }
    });

    it("Can make delete request.", async () => {
        const obj: Order = await createOrder();
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