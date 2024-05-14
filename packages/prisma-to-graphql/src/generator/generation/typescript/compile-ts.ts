import {rename} from 'node:fs/promises';
import {join} from 'node:path';
import {
    CompilerOptions,
    ModuleKind,
    createCompilerHost,
    createProgram,
    parseJsonConfigFileContent,
    readConfigFile,
    sys,
} from 'typescript';
import {packageDir} from '../../../util/file-paths';

/**
 * With the given file paths, compiles each TypeScript file into ESM JavaScript (with the `.mjs`
 * extension), CommonJS JavaScript (with the `.cjs` extension), and declaration TypeScript (with the
 * `.d.ts` extension). The original `.ts` file is preserved.
 *
 * @category Prisma Generator
 */
export async function compileTs(filePaths: ReadonlyArray<string>): Promise<void> {
    const tsFilePaths = filePaths.filter((filePath) => filePath.endsWith('.ts'));
    const packageTsconfig = readTsconfig();

    await writeTsFiles(
        tsFilePaths,
        {
            ...packageTsconfig,
            declaration: true,
            module: ModuleKind.ES2022,
        },
        '.mjs',
    );
    await writeTsFiles(
        tsFilePaths,
        {
            ...packageTsconfig,
            declaration: false,
            module: ModuleKind.CommonJS,
        },
        '.cjs',
    );
}

function readTsconfig() {
    const tsconfigPath = join(packageDir, 'tsconfig.json');
    const configFile = readConfigFile(tsconfigPath, sys.readFile);
    const config = parseJsonConfigFileContent(configFile.config, sys, './');

    return config.options;
}

async function writeTsFiles(
    filePaths: ReadonlyArray<string>,
    options: CompilerOptions,
    outputExtension: string,
) {
    createProgram(filePaths, options, createCompilerHost(options)).emit();
    await Promise.all(
        filePaths.map(async (filePath) => {
            await rename(filePath.replace('.ts', '.js'), filePath.replace('.ts', outputExtension));
        }),
    );
}
