import { CompilerOptions, transpile } from 'typescript';

/**
 * Remove comments from the code as comments has caused unexpected behaviour when running code from environmental variable with node
 *
 * @param tsCode
 * @param compilerOptions
 * @returns
 */
export function transpileToJs(
	tsCode: string,
	compilerOptions: CompilerOptions,
): string {
	const opts: CompilerOptions = {
		...compilerOptions,
		removeComments: true,
	};
	const jsCode = transpile(tsCode, opts);
	return jsCode;
}
