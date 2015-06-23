import TerminalBuffer from './TerminalBuffer';

/**
 * A base class to wrap a buffer.
 * You may want to do something before writing to the original buffer, maybe apply a color, etc.
 * By default passes through all property access and method calls
 */
export default class TerminalBufferWrapper implements TerminalBuffer {
	constructor(protected parent: TerminalBuffer) {}

	get height() {
		return this.parent.height;
	}

	set height(height: number) {
		this.parent.height = height;
	}

	get width() {
		return this.parent.width;
	}

	set width(width: number) {
		this.parent.width = width;
	}

	get maxX() {
		return this.parent.maxX;
	}

	get maxY() {
		return this.parent.maxY;
	}

	get minX() {
		return this.parent.minX;
	}

	get minY() {
		return this.parent.minY;
	}

	get(x: number, y: number) {
		return this.parent.get(x, y);
	}

	put(x: number, y: number, char: string, styles: Array<string>) {
		this.parent.put(x, y, char, styles);
	}

	write(x: number, y: number, text: string, styles: Array<string>) {
		this.parent.write(x, y, text, styles);
	}

	clear() {
		this.parent.clear();
	}
}
