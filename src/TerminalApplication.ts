import Terminal from './Terminal';
import Element from './elements/Element';
import TerminalBufferRoot from './buffers/TerminalBufferRoot';
import {EventEmitter} from 'events';

/**
 * A class to tie together elements and the terminal
 * Handles focus and rerendering upon changes
 * Elements can be assigned as views. Upon rendering the currently shown element will be rendered onto an empty buffer.
 * This buffer will then be rendered onto the terminal
 */
export default class TerminalApplication extends EventEmitter {
	private terminal: Terminal = new Terminal();
	private views: {[prop: string]: Element} = {};
	private current: Element;

	constructor(private debug: boolean = false) {
		super();
	}

	start() {
		if(!this.current) throw new Error('No views added!');

		this.terminal.attach();
		this.terminal.on('resize', () => this.render());

		this.terminal.on('key', (key: string) => {
			this.emit(key);
			this.emit('key', key);

			if(this.current && this.current.focussed) {
				this.current.focussed.emit('key', key);
			}
		});

		this.render();
	}

	stop() {
		this.terminal.detach();
		process.exit();
	}

	render() {
		let buffer = new TerminalBufferRoot({width: this.terminal.width, height: this.terminal.height});
		this.current.render(buffer);

		if(!this.debug) this.terminal.renderBuffer(buffer);
	}

	showView(name: string) {
		if(this.views[name]) {
			if(this.current) this.current.blur();

			this.current = this.views[name];
			if(this.current.focussable) this.current.focus();

			this.render();
		} else {
			throw new Error('View not found');
		}
	}

	addView(name: string, view: Element) {
		view.locked = true;

		view.on('change', () => {
			if(this.current === view) this.render();
		});

		view.on('focus', () => {
			if(this.current === view) this.render();
		});

		this.views[name] = view;
		if(!this.current) this.showView(name);
	}
}
