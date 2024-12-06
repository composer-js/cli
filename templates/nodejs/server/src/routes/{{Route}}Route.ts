///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
import {
{{#if hasModel}}
    ModelRoute,
    RepoUtils,
{{/if}}
    RouteDecorators,
} from "@composer-js/service-core";
import { DocDecorators, JWTUser, ObjectDecorators, UserUtils } from "@composer-js/core";
import { Request as XRequest, Response as XResponse } from "express";
{{#each dependencies}}
import {{{this}}} from "../models/{{{this}}}";
{{/each}}
const { Description, Returns } = DocDecorators;
const { Config, Init, Logger } = ObjectDecorators;
const {
    Auth,
{{#if hasModel}}
    Model,
{{/if}}
    Param,
    Query,
    Request,
    Route,
    Validate,
{{#each methods}}
    {{{this}}},
{{/each}}
} = RouteDecorators;
const AuthUser = RouteDecorators.User;

/**
 * Handles all REST API requests for the endpoint `{{{endpoint}}}`.
 * 
 * @author {{{author}}}
 */
{{#if hasModel}}@Model({{{Schema}}}){{/if}}
@Route("{{{endpoint}}}")
class {{{Route}}}Route {{#if hasModel}}extends ModelRoute<{{{Schema}}}> {{/if}}{
    @Config()
    protected config: any;

    @Logger
    protected logger: any;
    
{{#if hasModel}}
    protected repoUtilsClass: any = RepoUtils<{{{Schema}}}>;

{{/if}}
    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
{{#if hasModel}}
        super();
{{/if}}
    }

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
    private validate(obj: {{#if hasModel}}Partial<{{{Schema}}}> | Array<Partial<{{{Schema}}}>>{{else}}any{{/if}}): {{#if hasModel}}Promise<void>{{else}}void{{/if}} {
        {{#if hasModel}}return super.doValidate(obj);{{/if}}
    }

{{#each routes}}

    @Description(`
        {{{this.description}}}
    `)
{{#if this.security}}
    @Auth({{{this.security}}})
{{/if}}
    @{{{this.Method}}}({{#if this.path}}"{{{this.path}}}"{{/if}})
{{#if (or (eq name "create") (eq name "update"))}}
    @Validate("validate")
{{/if}}
{{#if this.responseType}}
    @Returns([{{{this.responseType}}}])
{{/if}}
    private async {{{this.name}}}({{#if (eq name "count")}}@Param() params: any, @Query() query: any, {{/if}}{{#if (eq name "findAll")}}@Param() params: any, {{/if}}{{#each this.params}}@Param("{{{this}}}") {{{this}}}: string, {{/each}}{{#if this.hasQuery}}@Query() query: any, {{/if}}{{#if this.requestType}}obj{{#if (eq name "create")}}s{{/if}}: Partial<{{{this.requestType}}}>{{#if (eq name "create")}} | Array<Partial<{{{this.requestType}}}>>{{/if}}, {{/if}}@Request req: XRequest{{#if (eq name "count")}}, @Response res: XResponse{{/if}}, @AuthUser {{#if this.security}}user{{else}}user?{{/if}}: JWTUser): Promise<{{#if this.responseType}}{{{this.responseType}}}{{#if (eq name "create")}} | Array<{{{this.requestType}}}>{{/if}}{{#if (eq this.name "findById")}} | undefined{{/if}}{{else}}void{{/if}}> {
{{#if (eq name "count")}}
        return super.doCount({ params, query, req, res, user });
{{else if (eq name "create")}}
        return super.doCreate(objs, { req, user });
{{else if (eq name "delete")}}
        return super.doDelete(id, { req, user });
{{else if (eq name "findAll")}}
        return super.doFindAll({ params, query, req, user });
{{else if (eq name "findById")}}
        return super.doFindById(id, { req, user });
{{else if (eq name "truncate")}}
        return super.doTruncate({ req, user });
{{else if (eq name "update")}}
        return super.doUpdate(id, obj, { req, user });
{{else}}
        throw new Error("This route is not implemented.");
{{/if}}
    }
{{/each}}
}

export default {{{Route}}}Route;
