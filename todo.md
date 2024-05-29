# todo

-   build sane authentication middleware
-   add deletion resolver
-   add a config for a max item request count
    -   use operation scope, add `take` scope
-   test many-to-many operations with the regions table
-   try on a real prisma schema
-   add plugin that allows per-field limitations
    -   like a limit on string field length
-   test using boolean fields in where clauses (AND, OR, NOT, etc.)
-   make an easy type helper that converts a `fetchGraphql` function into a query type
    -   like `type FetchQuery<T extends function, Operation extends OperationType> = {User: {}}` so that it's easy to make individual shared queries
    -   see `scopes data with lots of entries` test
    -   test / support postgres enums

# in progress
