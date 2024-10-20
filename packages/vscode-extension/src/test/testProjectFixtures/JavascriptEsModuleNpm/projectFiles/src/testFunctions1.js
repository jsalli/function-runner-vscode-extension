// esModuleExportNamedArrowFunction
export const namedArrowFunction = async (myArg) => {
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	await sleep(10);
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
