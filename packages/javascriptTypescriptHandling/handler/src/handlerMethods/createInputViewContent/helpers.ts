import { factory, Statement } from 'typescript';

export function createEmptyNode<T extends Statement>(): T {
	return factory.createIdentifier('') as unknown as T;
}

export function createEmptyLineNode<T extends Statement>(): T {
	return factory.createIdentifier('\n') as unknown as T;
}
