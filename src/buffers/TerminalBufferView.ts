import TerminalBuffer from './TerminalBuffer';

/**
 * A view into a parent TerminalBuffer
 * Basically a rectangular part of the parent TerminalBuffer
 * Writes and reads at an offset to the parent buffer
 */
export default class TerminalBufferView implements TerminalBuffer {
	public width: number;
	public height: number;
	public maxX: number = -1;
	public maxY: number = -1;
	public minX: number;
	public minY: number;
	private x: number;
	private y: number;

	constructor(private parent: TerminalBuffer,	{x = 0, y = 0, width, height}: {x?: number, y?: number, width?: number, height?: number} = {}, private overflow: boolean = true) {
		this.x = x;
		this.y = y;
		this.width = width || parent.width - x;
		this.height = height || parent.height - y;
		this.minX = this.width;
		this.minY = this.height;
	}

	clear() {
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.height; x++) {
				this.put(x, y, ' ');
			}
		}
	}

	put(x: number, y: number, char: string, styles: Array<string> = []) {
		if(!this.overflow) {
			if(x < 0 || y < 0) return;
			if(x >= this.width || y >= this.height) return;
		}

		this.parent.put(this.x + x, this.y + y, char, styles);
		this.maxX = Math.max(x, this.maxX);
		this.maxY = Math.max(y, this.maxY);
		this.minX = Math.min(x, this.minX);
		this.minY = Math.min(y, this.minY);
	}

	get(x: number, y: number) {
		return this.parent.get(this.x + x, this.y + y);
	}

	/**
	 * Write something into our parent buffer
	 * Breaks lines at our own buffer border
	 */
	write(x: number, y: number, text: string, styles?: Array<string>) {
		let chars = text.split('');

		chars.forEach((char) => {
			this.put(x++, y, char, styles);

			if(x === this.width) {
				y += 1;
				x = 0;
			}
		});
	}
}
