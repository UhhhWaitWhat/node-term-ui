/**
 * A TerminalBuffer is a representation of a rectangular page of terminal output
 * It has a fixed width and height and may create child Buffers
 */
interface TerminalBuffer {
	/** Width and height need to be accessible so children may calculate their own width as a percentage */
	width: number
	height: number

	/**
	 * Maximum coordinates this buffer has been written to
	 * Useful to gauge how tall a previously rendered element was
	 * Max values default to -1, min values default to width and height respectively
	 */
	maxX: number
	maxY: number
	minX: number
	minY: number

	/** Clear the entire buffer */
	clear(): void

	/**
	 * Put a single character at position (x, y)
	 * Styles may be an array of strings corresponding to the styles provided by [ansi-styles](npm.org/packages/ansi-styles)
	 * Coordinates may be out-of-bounds
	 */
	put(x: number, y: number, char: string, styles?: Array<string>): void

	/**
	 * Get a single character at position (x, y)
	 * Coordinates may be out-of-bounds
	 */
	get(x: number, y: number): string

	/**
	 * Write a string of text at position(x, y)
	 * Lines are broken at buffer boundaries (no word detection, might break mid-syllable)
	 * Styles work identical to put()
	 */
	write(x: number, y: number, text: string, styles?: Array<string>): void
}

export default TerminalBuffer;
