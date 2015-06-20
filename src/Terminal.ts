import {EventEmitter} from 'events';
import {terminal as term} from 'terminal-kit';
import TerminalBuffer from './buffers/TerminalBuffer';
import TerminalBufferRoot from './buffers/TerminalBufferRoot';

/**
 * A class to make dealing with the terminal as painless as possible
 * Should allow switching of backend libraries if ever neccessary
 *
 * TODO: Deal with key names?? Would be tricky after a library change right now
 */
export default class Terminal extends EventEmitter {
	public attached: boolean = false;
	private buffer: TerminalBufferRoot = new TerminalBufferRoot({width: term.width, height: term.height});

	constructor(public name = 'Terminal') {
		super();

		term.on('key', (key: string) => {
			this.emit(key);
			this.emit('key', key);
		});

		term.on('terminal', (type: string) => {
			if(type === 'SCREEN_RESIZE') {
				this.emit('resize');
			}

			if(type === 'FOCUS_IN') {
				this.emit('focus');
			}

			if(type === 'FOCUS_OUT') {
				this.emit('blur');
			}
		});
	}

	get width() {
		return term.width;
	}

	get height() {
		return term.height;
	}

	/**
	 * Move cursor to position and print the char
	 * Char may be any string, including control characters
	 */
	put(x: number, y: number, text: string) {
		if(!this.attached) return;

		term.moveTo(x, y, text);
	}

	/**
	 * Render a TerminalBuffer instance into our terminal
	 * Diffs the given buffer against our internal buffer and updates only the neccessary parts
	 */
	renderBuffer(buffer: TerminalBuffer) {
		if(!this.attached) return;

		/*
		 * Clear the previous buffer if needed
		 * This might be optimisable, if we can rely on the terminal to clear the non-visible buffer?
		 */
		if(this.buffer.width !== this.width || this.buffer.height !== this.height) {
			this.buffer.width = this.width;
			this.buffer.height = this.height;

			this.clear();
		}

		buffer.width = this.width;
		buffer.height = this.height;

		let a = 0;
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				if(this.buffer.get(x, y) !== buffer.get(x, y)) {
					this.buffer.put(x, y, buffer.get(x, y));
					this.put(x + 1, y + 1, buffer.get(x, y));
				}
			}
		}
	}

	clear() {
		if(!this.attached) return;

		this.buffer.clear();
		term.clear();
	}

	/**
	 * Attach to stdin and stdout
	 * Also Swap in a secondary buffer, so we can emulate a fullscreen application
	 */
	attach() {
		this.attached = true;
		term.fullscreen(true);
		term.hideCursor(true);
		term.windowTitle(this.name);
		term.grabInput({
			focus: true
		});
	}

	detach() {
		this.attached = false;
		term.fullscreen(false);
		term.grabInput(false);
	}
}
