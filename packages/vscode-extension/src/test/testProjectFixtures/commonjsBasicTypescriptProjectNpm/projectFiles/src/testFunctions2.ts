// Array Destruction In Params
export function arrayDestructionInParams(
	myArg: string,
	[my2ndArg]: [my2ndArg: string],
): string {
	return `${myArg} - ${my2ndArg}`;
}

// Object Destruction In Params
export const aobjectDestructionInParams = (
	myArg: string,
	{ my2ndArg }: { my2ndArg: string },
) => {
	return `${myArg} - ${my2ndArg}`;
};

// esModuleExportDefaultWArrowFunction
export default (myArg: string): string => {
	if (myArg.length === 0) {
		throw new Error('myArg is an empty string')
	}
	return `Hello ${myArg}!`;
};

const arrowFunctionWhichIsNotExported = (myArg: number): string => {
	return `Big number: ${myArg * 1000}`;
};
