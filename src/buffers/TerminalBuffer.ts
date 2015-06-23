/**
 * A TerminalBuffer is a representation of a rectangular page of terminal output
 * It has a fixed width and height and may create child Buffers
 */
interface TerminalBuffer {
	/** Width and height need to be accessible so children may calculate their own width as a percentage */
	width: number;
	height: number;

	/** Clear the entire buffer */
	clear(): void;

	/**
	 * Put a single character at position (x, y)
	 * Styles may be an array of strings corresponding to the styles provided by [ansi-styles](npm.org/packages/ansi-styles)
	 * Coordinates may be out-of-bounds
	 */
	put(x: number, y: number, char: string, styles?: Array<string>): void;

	/**
	 * Get a single character at position (x, y)
	 * Coordinates may be out-of-bounds
	 */
	get(x: number, y: number): string;

	/**
	 * Write a string of text at position(x, y)
	 * Lines are broken at buffer boundaries (no word detection, might break mid-syllable)
	 * Styles work identical to put()
	 */
	write(x: number, y: number, text: string, styles?: Array<string>): void;

	/**
	 * Copy an entire buffer into this one at an offset
	 */
	writeBuffer(x: number, y: number, buffer: TerminalBuffer): void;
}

export default TerminalBuffer;
