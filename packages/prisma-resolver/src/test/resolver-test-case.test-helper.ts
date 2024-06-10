import {RequireExactlyOne} from 'type-fest';
import {PrismaResolverOutput} from '../resolver/prisma-resolver';
import {PrismaClient} from './resolver-seed-data.mock';

export type ResolverTestCaseParams = {prismaClient: PrismaClient};
export type ResolverTestCase = {
    it: string;
    skipSeeding?: boolean | undefined;
    test({prismaClient}: ResolverTestCaseParams): Promise<PrismaResolverOutput>;
} & RequireExactlyOne<{
    expect: PrismaResolverOutput;
    throws: string;
}>;
export type ResolverTests = {
    describe: string;
    cases: ResolverTestCase[];
};
