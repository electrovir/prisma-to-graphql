import {GraphQLError} from 'graphql';
import {assertThrows} from 'run-time-assertions';
import {rethrowPrismaError} from './prisma-upsert-operation';

describe(rethrowPrismaError.name, () => {
    it('simplifies a prisma error', () => {
        const originalMessage = `  21 }
  22 
  23 try {
→ 24     const updatedEntry = await prismaClient[prismaModelName].upsert({
           where: {
         ?   id?: String,
         ?   email?: String,
         ?   AND?: UserWhereInput | UserWhereInput[],
         ?   OR?: UserWhereInput[],
         ?   NOT?: UserWhereInput | UserWhereInput[],
         ?   createdAt?: DateTimeFilter | DateTime,
         ?   updatedAt?: DateTimeFilter | DateTime,
         ?   firstName?: StringNullableFilter | String | Null,
         ?   lastName?: StringNullableFilter | String | Null,
         ?   role?: StringNullableFilter | String | Null,
         ?   phoneNumber?: StringNullableFilter | String | Null,
         ?   settings?: UserSettingsNullableRelationFilter | UserSettingsWhereInput | Null
           },
           create: {
             firstName: "new user"
           },
           update: {
             firstName: "new user"
           },
           select: {
             firstName: true,
             lastName: true,
             email: true,
             role: true
           }
         })

Argument \`where\` of type UserWhereUniqueInput needs at least one of \`id\` or \`email\` arguments. Available options are marked with ?.`;

        assertThrows(() => rethrowPrismaError(originalMessage), {
            matchMessage: 'Argument `where` needs at least one of `id` or `email` arguments.',
            matchConstructor: GraphQLError,
        });
    });
});
