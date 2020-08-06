===============================================================================
{{{Schema}}}
===============================================================================

{{{description}}}

The following is the list of all members included in the data schema.

.. list-table::
   :header-rows: 1

   * - Member
     - Description
     - Type
     - Format/Schema
     - Default Value
     - Identifier
     - Unique
     - Required
{{#each members}}
   * - ``{{{name}}}``
     - {{{description}}}
     - ``{{{type}}}``
     - {{{format}}}
     - ``{{{defaultValue}}}``
     - {{#if identifier}}true{{else}}false{{/if}}
     - {{#if unique}}true{{else}}false{{/if}}
     - {{#if nullable}}false{{else}}true{{/if}}
{{/each}}

Examples
========
{{#each examples}}
{{Name}}
-------------------------------------------------------------------------------
{{description}}

.. code-block:: json
    
    {{{value}}}

{{/each}}

Members
=======
{{#each members}}

{{{name}}}
-------------------------------------------------------------------------------

Type: `{{{type}}}`
{{#if (eq this.type "enum")}}

Enum Values:
{{#each this.values}}
- {{this}}
{{/each}}
{{/if}}

Default Value: ``{{{defaultValue}}}``

Required: {{#if nullable}}false{{else}}**true**{{/if}}

{{#if unique}}
*Unique* {{/if}}{{#if identifier}}*Identifier*

{{/if}}
{{{description}}}
{{/each}}