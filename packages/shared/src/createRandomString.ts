const charactersForRandomName: string[] = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
];

let charIndexState = 0;

// Produces unique strings only until value "789" when for example lenght is 3.
// After that the next one is "ABC" which has been seen before.
// This should not matter in testing mode, there are enough unique values for testing cases
function pseudoRandomString(length: number, increase?: number): string {
	let charIndexStateToUse = charIndexState + (increase ? increase : 0);

	if (charIndexStateToUse + length > charactersForRandomName.length) {
		charIndexStateToUse = increase ? increase : 0;
	}

	const startIndex = charIndexStateToUse;
	const endIndex = charIndexStateToUse + length;
	const str = charactersForRandomName.slice(startIndex, endIndex).join('');
	if (increase === undefined) {
		charIndexState++;
	}

	return str;
}

/**
 * Get the next in line identifier but don't increase it so that the createRandomIdentifier will return the same value on next call as this function now
 * @param length
 * @returns
 */
export function getNextRandomIdentifier(
	increase: number,
	length: number = 3,
): string {
	return pseudoRandomString(length, increase);
}

export function createRandomIdentifier(length: number = 3): string {
	return pseudoRandomString(length);
}
