# todo

-   features
    -   build sane authentication middleware
    -   apply max count to nested arrays
    -   allow any data to be passed from the prisma schema in `@graphql` comments, attach it the to generated models file
-   testing
    -   test a deletion that fails due to foreign key constraints (with cascade deletion turned off)
    -   test many-to-many operations with the regions table
    -   try on a real prisma schema
    -   test using boolean fields in where clauses (AND, OR, NOT, etc.)
    -   setup a postgres test
        -   test / support postgres enums
    -   test only generating mutations
    -   test only generating queries

# in progress

-   add deletion resolver
