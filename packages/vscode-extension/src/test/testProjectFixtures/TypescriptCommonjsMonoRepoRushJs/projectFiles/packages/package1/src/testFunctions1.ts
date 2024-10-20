// esModuleExportNamedArrowFunction
export const namedArrowFunction = async (myArg: string): Promise<boolean> => {
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
	await sleep(10);
	return myArg.length > 0;
};

// esModuleExportDefaultFunction
export default function (myArg: number, secondArg: string): string {
	return `Big number: ${myArg * 1000} ${secondArg}`;
}

// esModuleExportNamedFunction
export function namedFunction(myArg: number): number {
	return myArg * 1000;
}

// Not exported function
function functionWhichIsNotExported(myArg: number): string {
	return `Big number: ${myArg * 1000}`;
}

// Function type declaration
export declare function funcDeclaration(myArg: string): string;
