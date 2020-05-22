///////////////////////////////////////////////////////////////////////////////
// Copyright (C) {{year}} {{{copyright}}}
///////////////////////////////////////////////////////////////////////////////
import { Column, Entity, Index, Unique } from "typeorm";
import { {{#if baseClass}}{{baseClass}}, {{/if}}Cache, Identifier } from "@composer-js/service-core";
{{#each dependencies}}
import {{this}} from "./{{this}}";
{{/each}}
{{#each members}}
{{#if (eq this.type "enum")}}

/**
 * {{{this.description}}}
 */
export enum {{{Schema}}}{{{this.Name}}} {
{{#each this.values}}
    {{this}},
{{/each}}
}
{{/if}}
{{/each}}

/**
 * {{{description}}}
 *
 * @author {{{author}}}
 */
@Entity()
@Cache()
{{#unless isNone}}
@Unique(["uid"{{#each members}}{{#if this.identifier}}, "{{{this.name}}}"{{/if}}{{/each}}])
{{/unless}}
export default class {{{Schema}}}{{#if baseClass}} extends {{baseClass}}{{/if}} {
{{#each members}}
    /**
     * {{{this.description}}}
     */
    {{#if this.identifier}}
    @Identifier
    @Index()
    {{/if}}
    @Column()
    public {{{this.name}}}: {{#if (eq this.type "enum")}}{{{Schema}}}{{{this.Name}}} = {{{Schema}}}{{{this.Name}}}.{{{this.defaultValue}}}{{else}}{{{this.type}}}{{#if nullable}} | undefined{{/if}} = {{#if nullable}}undefined{{else}}{{{this.defaultValue}}}{{/if}}{{/if}};

{{/each}}
    constructor(other?: any) {
        {{#if baseClass}}
        super(other);
        
        {{/if}}
        if (other) {
        {{#each members}}
            this.{{{this.name}}} = other.{{{this.name}}} !== undefined ? other.{{{this.name}}} : this.{{{this.name}}};
        {{/each}}
        }
    }
}
