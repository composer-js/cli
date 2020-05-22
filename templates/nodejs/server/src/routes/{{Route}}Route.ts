///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
import {
    AccessControlList,
    ACLRecord,
    Auth,
    Config,
    Init,
    Logger,
    Model,
    ModelRoute,
    {{#if usesMongodb}}Mongo{{/if}}Repository,
    ModelUtils,
    Param,
    Query,
    Route,
    User as AuthUser,
    Validate,
{{#each methods}}
    {{{this}}},
{{/each}}
} from "@composer-js/service-core";
import { JWTUser, UserUtils } from "@composer-js/core";
{{#each dependencies}}
import {{{this}}} from "../models/{{{this}}}";
{{/each}}
{{#if hasModel}}
import { {{#if usesMongodb}}Mongo{{/if}}Repository as Repo } from "typeorm";
{{/if}}

/**
 * Handles all REST API requests for the endpoint `{{{endpoint}}}`.
 * 
 * @author {{{author}}}
 */
{{#if hasModel}}@Model({{{Schema}}}){{/if}}
@Route("{{{endpoint}}}")
class {{{Route}}}Route {{#if hasModel}}extends ModelRoute<{{{Schema}}}> {{/if}}{
    @Config
    protected config: any;

    @Logger
    protected logger: any;
    
    {{#if hasModel}}
    @{{#if usesMongodb}}Mongo{{/if}}Repository({{{Schema}}})
    protected repo?: Repo<{{{Schema}}}>;

    {{/if}}
    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
    {{#if hasModel}}
        super();
    {{/if}}
    }
    {{#if hasModel}}
    /**
     * Called by the system on startup to create the default access control list for objects of this type.
     */
    protected getDefaultACL(): AccessControlList | undefined {
        // TODO Customize default ACL for this type
        const records: ACLRecord[] = [];

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

        return {
            uid: "{{{Schema}}}",
            dateCreated: new Date(),
            dateModified: new Date(),
            version: 0,
            records,
        };
    }
    {{/if}}

    /**
     * Called on server startup to initialize the route with any defaults.
     */
    @Init
    private async initialize() {
        // TODO Add business logic here
    }

    /**
     * Determines if the specified request payload is valid and can be accepted.
     *
     * @throws When the request payload contains invalid input or data.
     */
    private validate(data: {{#if hasModel}}{{{Schema}}}{{else}}any{{/if}}): void {
        // TODO Validate input data
    }

{{#each routes}}

    /**
     * {{{this.description}}}
     */
    {{#if this.security}}
    @Auth({{{this.security}}})
    {{/if}}
    @{{{this.Method}}}({{#if this.path}}"{{{this.path}}}"{{/if}})
    {{#if (or (eq name "create") (eq name "update"))}}
    @Validate("validate")
    {{/if}}
    private async {{{this.name}}}({{#if (eq name "count")}}@Param() params: any, @Query() query: any, {{/if}}{{#if (eq name "findAll")}}@Param() params: any, {{/if}}{{#each this.params}}@Param("{{{this}}}") {{{this}}}: string, {{/each}}{{#if this.hasQuery}}@Query() query: any, {{/if}}{{#if this.requestType}}obj: {{{this.requestType}}}, {{/if}}@AuthUser user?: JWTUser): Promise<{{#if this.responseType}}{{{this.responseType}}}{{#if (eq this.name "findById")}} | undefined{{/if}}{{else}}void{{/if}}> {
        {{#if this.requestType}}
        const newObj: {{{@root.Schema}}} = new {{{@root.Schema}}}(obj);

        {{/if}}
        {{#if (eq name "count")}}
        return super.doCount(params, query, user);
        {{else if (eq name "create")}}
        return super.doCreate(newObj, user);
        {{else if (eq name "delete")}}
        return super.doDelete(id, user);
        {{else if (eq name "findAll")}}
        return super.doFindAll(params, query, user);
        {{else if (eq name "findById")}}
        return super.doFindById(id, user);
        {{else if (eq name "truncate")}}
        return super.doTruncate(user);
        {{else if (eq name "update")}}
        return super.doUpdate(id, newObj, user);
        {{else}}
        throw new Error("This route is not implemented.");
        {{/if}}
    }
{{/each}}
}

export default {{{Route}}}Route;
