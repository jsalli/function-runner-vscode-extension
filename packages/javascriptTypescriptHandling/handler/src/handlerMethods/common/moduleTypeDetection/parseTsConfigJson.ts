import { parse } from 'path';
import { readFilePathSync } from '@functionrunner/shared';
import json5 from 'json5';
import {
	CompilerOptions,
	ParseConfigHost,
	parseJsonConfigFileContent,
	sys,
} from 'typescript';

// export function getRawTsConfigCompilerOptionsObject(
// 	tsConfigAbsPath: string,
// ): object {
// 	const tsconfigJsonStr = readFilePathSync(tsConfigAbsPath);
// 	const tsconfigJsonParsed = json5.parse(tsconfigJsonStr) as CompilerOptions;
// 	const { compilerOptions } = tsconfigJsonParsed;
// 	// compilerOptions['module'] = 'commonjs';
// 	return compilerOptions;
// }

export function parseTsConfigJson(tsConfigAbsPath: string): CompilerOptions {
	const tsconfigJsonStr = readFilePathSync(tsConfigAbsPath);
	const tsconfigJsonParsed = json5.parse<CompilerOptions>(tsconfigJsonStr);

	const parseConfigHost: ParseConfigHost = {
		useCaseSensitiveFileNames: true,
		readDirectory: sys.readDirectory,
		fileExists: sys.fileExists,
		readFile: sys.readFile,
	};

	const tsconfigFolder = parse(tsConfigAbsPath).dir;
	const tsconfig = parseJsonConfigFileContent(
		tsconfigJsonParsed,
		parseConfigHost,
		tsconfigFolder,
	);

	return tsconfig.options;
}
