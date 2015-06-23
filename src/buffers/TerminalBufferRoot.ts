import strip = require('strip-ansi');
import ansi = require('ansi-styles');
import TerminalBuffer from './TerminalBuffer';

/**
 * A top-level TerminalBuffer
 * Stores data internally and safeguards against out-of-bounds access
 */
export default class TerminalBufferRoot implements TerminalBuffer {
	private data: Array<Array<string>>;

	constructor({width, height}: {width?: number, height?: number} = {}) {
		this.data = [];

		this.width = width || 0;
		this.height = height || 0;
	}

	/** Handle Adjusting width and height properly, so our array is always the absolute source of truth */
	get width() {
		return this.data.length;
	}

	set width(next: number) {
		let cur = this.width;

		if(cur > next) {
			for(let x = cur; x > next; x--) {
				this.data.pop();
			}
		} else if(cur < next) {
			for(let x = cur; x < next; x++) {
				this.data.push(new Array(this.height));
			}
		}
	}

	get height() {
		return this.data[0] ? this.data[0].length : 0;
	}

	set height(next: number) {
		let cur = this.height;

		if(cur > next) {
			for(let y = cur; y > next; y--) {
				for(let x = 0; x < this.width; x++) {
					this.data[x].pop();
				}
			}
		} else if(cur < next) {
			for(let x = 0; x < this.width; x++) {
				this.data[x].length = next;
			}
		}
	}

	clear() {
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				this.put(x, y, ' ');
			}
		}
	}

	put(x: number, y: number, char: string, styles: Array<string> = []) {
		if(strip(char).length > 1) throw new Error('Only single characters are allowed');

		if(x < 0 || y < 0) return;
		if(x >= this.width || y >= this.height) return;

		let openers = styles.map((style) => ansi[style] ? ansi[style].open : '').join('');
		let closers = styles.reverse().map((style) => ansi[style] ? ansi[style].close : '').join('');

		this.data[x][y] = openers + char + closers;

		/* Reverse call modifies array in-place -.- */
		styles.reverse();
	}

	get(x: number, y: number) {
		if(x < 0 || y < 0) return ' ';
		if(x >= this.width || y >= this.height) return ' ';

		return this.data[x][y] || ' ';
	}

	write(x: number, y: number, text: string, styles: Array<string> = []) {
		let chars = text.split('');

		chars.forEach((char) => {
			if(x >= this.width) {
				y += 1;
				x = 0;
			}

			this.put(x++, y, char, styles);
		});
	}

	writeBuffer(offsetX: number, offsetY: number, buffer: TerminalBuffer) {
		for(let y = 0; y < this.width; y++) {
			for(let x = 0; x < this.width; x++) {
				this.put(x + offsetX, y + offsetY, buffer.get(x, y));
			}
		}
	}
}
