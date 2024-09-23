/**
 * Create a random string of letters and numbers. The generated string
 * will begin with a letter 'a' but the rest of it is random. A string
 * starting with a number could cause problems in some cases
 * @param length
 * @returns
 */
export function generateRandomString(length: number = 8): string {
	return `a${Math.random()
		.toString(32)
		.substring(4, 4 + length)}`;
}

export function capitalizeFirstLetter(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
