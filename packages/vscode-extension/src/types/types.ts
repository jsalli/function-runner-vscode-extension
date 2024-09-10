export interface LocalStorage {
	getValue<T>(key: string): T | null;
	setValue<T>(key: string, value: T): void;
}

export interface TestCase {
	name: string;
	inputs: TestInput[];
	output: TestOutput;
}

export interface TestInput {
	paramName: string;
	type: string;
}

export interface TestOutput {
	type: string;
}
