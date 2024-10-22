/**
 * Fix breaking code when feeding code with a new line character in code
 * which is not a line break in the file but part of the code.
 *
 * Don't replace \\n just \n
 *
 * @example
 * const list = text.split('\n');
 *
 * @param code
 * @returns
 */
export function escapeInCodeNewlines(code: string): string {
	const temp = code.replaceAll(/(?<!\\)\\n/g, '\\\\n');
	// const temp = code.replaceAll('\\n', '\\\\n');
	return temp;
}
