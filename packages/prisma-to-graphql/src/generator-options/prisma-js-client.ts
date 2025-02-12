import {log, type SelectFrom} from '@augment-vir/common';
import {type GeneratorConfig} from '@prisma/generator-helper';
import prismaInternals from '@prisma/internals';

/**
 * Tries to find Prisma's default prisma-client-js generator and use its output path. If this fails,
 * it just returns `undefined`.
 *
 * @category Internal
 */
export function getOriginalPrismaJsClientOutputPath(
    otherGenerators: ReadonlyArray<
        Readonly<
            SelectFrom<
                GeneratorConfig,
                {
                    provider: {
                        value: true;
                    };
                    output: true;
                }
            >
        >
    >,
): string | undefined {
    const jsGenerator = otherGenerators.find(
        (generator) => generator.provider.value === 'prisma-client-js',
    );

    if (!jsGenerator) {
        log.warning('Failed to find prisma-client-js generator.');
        return undefined;
    } else if (!jsGenerator.output) {
        log.warning('Failed to read prisma-client-js generator output path.');
        return undefined;
    }

    return prismaInternals.parseEnvValue(jsGenerator.output);
}
