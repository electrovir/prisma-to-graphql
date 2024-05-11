import {itCases} from '@augment-vir/chai';
import {removeSuffix} from '@augment-vir/common';
import {defaultGenerationOutput, plugin} from './plugin';
import {buildTestSchema} from './run-codegen.test-helper';

describe(plugin.name, () => {
    const indent = '            ';
    async function testBuildingSchema(schemaString: string): Promise<string> {
        const output = await buildTestSchema(schemaString);
        const truncatedOutput = removeSuffix({
            value: output.replace(defaultGenerationOutput, ''),
            suffix: ';',
        });

        const originalLines = truncatedOutput.split('\n');

        const indentedLines: string[] = [
            '',
            ...originalLines.map((line) =>
                [
                    indent,
                    line,
                ].join(''),
            ),
        ];

        return indentedLines.join('\n');
    }

    itCases(testBuildingSchema, [
        {
            it: 'handles a schema with no operations',
            input: /* GraphQL */ `
                type FakeUser {
                    id: String
                    email: String
                }
            `,
            expect: `
            {
                "Mutation": {},
                "Query": {}
            }`,
        },
        {
            it: 'handles a query with no args',
            input: /* GraphQL */ `
                type Query {
                    getStuff: FakeUser
                }

                type FakeUser {
                    id: String
                    email: String
                }
            `,
            expect: `
            {
                "Mutation": {},
                "Query": {
                    "getStuff": {
                        "args": {},
                        "output": "FakeUser"
                    }
                }
            }`,
        },
        {
            it: 'handles a query with args',
            input: /* GraphQL */ `
                type Query {
                    getStuff(something: String, somethingElse: Int): FakeUser
                }

                type FakeUser {
                    id: String
                    email: String
                }
            `,
            expect: `
            {
                "Mutation": {},
                "Query": {
                    "getStuff": {
                        "args": {
                            "something": "String",
                            "somethingElse": "Int"
                        },
                        "output": "FakeUser"
                    }
                }
            }`,
        },
        {
            it: 'handles multiple queries,',
            input: /* GraphQL */ `
                type Query {
                    getStuff: FakeUser
                    getStuff2(something: String!, somethingElse: Int): FakeUser!
                    getStuff3(init: FakeUser): Boolean
                }

                type FakeUser {
                    id: String
                    email: String
                }
            `,
            expect: `
            {
                "Mutation": {},
                "Query": {
                    "getStuff": {
                        "args": {},
                        "output": "FakeUser"
                    },
                    "getStuff2": {
                        "args": {
                            "something": "String!",
                            "somethingElse": "Int"
                        },
                        "output": "FakeUser!"
                    },
                    "getStuff3": {
                        "args": {
                            "init": "FakeUser"
                        },
                        "output": "Boolean"
                    }
                }
            }`,
        },
    ]);
});
