# Questions to Answer

1. If a table in a prisma schema has a non-automatically-generated id, does it still need to be omitted when setting relations?

# Features to support

-   support where block field ref inputs
    -   example: boolean where inputs in PrismaClient can be `{equals: <boolean>}` _or_ they can be `{equals: <name-of-other-boolean-field>}`
