// esModuleExportNamedArrowFunction
export const namedArrowFunction = (myArg) => {
	return myArg.length > 0;
};

// esModuleExportDefaultFunction
export default function (myArg, secondArg) {
	return `Big number: ${myArg * 1000} ${secondArg}`;
}

// esModuleExportNamedFunction
export function namedFunction(myArg) {
	return myArg * 1000;
}

// Not exported function
function functionWhichIsNotExported(myArg) {
	return `Big number: ${myArg * 1000}`;
}
