// Array Destruction In Params
export function arrayDestructionInParams(
	myArg,
	[my2ndArg],
) {
	return `${myArg} - ${my2ndArg}`;
}

// Object Destruction In Params
export const objectDestructionInParams = (
	myArg,
	{ my2ndArg },
) => {
	return `${myArg} - ${my2ndArg}`;
};

// esModuleExportDefaultWArrowFunction
export default (myArg) => {
	if (myArg.length === 0) {
		throw new Error('myArg is an empty string')
	}
	return `Hello ${myArg}!`;
};

const arrowFunctionWhichIsNotExported = (myArg) => {
	return `Big number: ${myArg * 1000}`;
};
