///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import * as request from "supertest";
import { Server, ConnectionManager{{#if hasModel}}, ACLRecord{{/if}} } from "@composer-js/service-core";
import { JWTUtils, Logger } from "@composer-js/core";
{{#if hasModel}}import { {{#if usesMongodb}}Mongo{{/if}}Repository, Connection } from "typeorm";{{/if}}
{{#if usesMongodb}}
import { MongoMemoryServer } from "mongodb-memory-server";
{{/if}}
{{#each dependencies}}
import {{{this}}} from "../src/models/{{{this}}}";
{{/each}}
const uuid = require("uuid");

{{#if usesMongodb}}
const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});
{{/if}}
{{#if usesSqlite}}
import * as sqlite3 from "sqlite3";
const sqlite: sqlite3.Database = new sqlite3.Database(":memory:");
{{/if}}

jest.setTimeout(30000);

describe("{{Route}} Tests", () => {
    const server: Server = new Server(config, undefined, "./src");
    const baseUrl = "{{{endpoint}}}";

    const admin: any = {
        uid: uuid.v4(),
        roles: config.get("trusted_roles"),
    };
    const adminToken = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
    };
    const authToken = JWTUtils.createToken(config.get("auth"), user);
    {{#if hasModel}}
    let repo: {{#if usesMongodb}}Mongo{{/if}}Repository<{{Schema}}>;
    let aclRepo: {{#if usesMongodb}}Mongo{{/if}}Repository<any>;

    const create{{Schema}} = async function(/** TODO Add initializers */): Promise<{{Schema}}> {
        const obj: {{Schema}} = new {{Schema}}({
            // TODO Add default test property values
            {{#each members}}
            {{{this.name}}}: {{{this.defaultValue}}},
            {{/each}}
        });
        
        const result: {{Schema}} = await repo.save(obj);

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
            parentUid: "{{{Schema}}}"
        };
        await aclRepo.save(aclRepo.create(acl));

        return result;
    }

    const create{{Schema}}s = async function(num: number, /** TODO Add initializers */): Promise<{{Schema}}[]> {
        const results: {{Schema}}[] = [];

        for (let i = 0; i < num; i++) {
            results.push(await create{{Schema}}());
        }

        return results;
    }
    {{/if}}

    beforeAll(async () => {
        {{#if usesMongodb}}
        await mongod.start();
        {{/if}}
        await server.start();

        {{#if hasModel}}
        let conn: any = ConnectionManager.connections.get("acl");
        if (conn instanceof Connection) {
            aclRepo = conn.get{{#if usesMongodb}}Mongo{{/if}}Repository("AccessControlList{{#if usesMongodb}}Mongo{{else}}SQL{{/if}}");
        }
        conn = ConnectionManager.connections.get("{{#if usesMongodb}}mongodb{{else}}<DATASTORE_NAME>{{/if}}");
        if (conn instanceof Connection) {
            repo = conn.get{{#if usesMongodb}}Mongo{{/if}}Repository("{{Schema}}");
        } else {
            throw new Error("Could not find mongodb connection");
        }
        {{/if}}

        // TODO
    });
    
    afterAll(async () => {
        {{#if hasModel}}
        try {
            await aclRepo.clear();
        } catch (err) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message != "ns not found") {
                throw err;
            }
        }
        
        {{/if}}
        await server.stop();
        {{#if usesMongodb}}
        await mongod.stop();
        {{/if}}
        // TODO
    });

    beforeEach(async () => {
        {{#if hasModel}}
        try {
            await repo.clear();
        } catch (err) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message != "ns not found") {
                throw err;
            }
        }
        {{/if}}
    });

{{#each routes}}

    it("Can make {{{name}}} request.", async () => {
        {{#if (or (eq name "findAll") (eq name "count") (eq name "truncate"))}}
        const objs: {{@root.Schema}}[] = await create{{@root.Schema}}s(5);
        {{else if (or (eq name "delete") (eq name "findById") (eq name "update"))}}
        const obj: {{@root.Schema}} = await create{{@root.Schema}}();
        {{/if}}
        {{#if this.path}}
        const url = baseUrl + "{{{path}}}";
        {{/if}}
        {{#if (eq name "create")}}
        const obj: {{{requestType}}} = new {{{requestType}}}({
            // TODO Provide better test values
            {{#each @root.members}}
            {{{this.name}}}: {{{this.defaultValue}}},
            {{/each}}
        });
        {{else if (eq name "update")}}
        // TODO Add update modifications
        //obj.variable = newvalue;
        {{else if requestType}}
        const obj: {{{requestType}}} = new {{{requestType}}}({
            // TODO Provide initial values
        });
        {{/if}}

        const result = await request(server.getApplication())
        {{#if security}}
            .{{{method}}}({{#if this.path}}url{{else}}baseUrl{{/if}})
            .set("Authorization", "jwt " + adminToken){{#if requestType}}
            .send(obj){{/if}};
        {{else}}
            .{{{method}}}({{#if this.path}}url{{else}}baseUrl{{/if}}){{#if requestType}}
            .send(obj){{/if}};
        {{/if}}

        expect(result).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        {{#if responseType}}
        expect(result.body).toBeDefined();
        {{#if (eq name "count")}}
        expect(result.body.count).toBe(objs.length);
        {{else if (or (eq name "create") (eq name "findById") (eq name "update"))}}
        {{#each @root.members}}
        expect(result.body.{{{this.name}}}).toEqual(obj.{{{this.name}}});
        {{/each}}
        {{else if (eq name "findAll")}}
        expect(result.body).toHaveLength(objs.length);
        // TODO Validate results further?
        {{else}}
        // TODO Validate result body
        {{/if}}
        {{/if}}

        {{#if (or (eq name "create") (eq name "update"))}}
        // Validate the contents were stored correctly
        const existing: {{@root.Schema}} | undefined = await repo.findOne({uid: obj.uid});
        expect(existing).toBeDefined();
        if (existing) {
            {{#each @root.members}}
            expect(existing.{{{this.name}}}).toEqual(obj.{{{this.name}}});
            {{/each}}
        }
        {{else if (eq name "delete")}}
        // Validate the contents were removed
        const count: number = await repo.count({uid: obj.uid});
        expect(count).toBe(0);
        {{else if (eq name "truncate")}}
        // Validate the contents were removed
        const count: number = await repo.count();
        expect(count).toBe(0);
        {{/if}}
    });
{{/each}}
});