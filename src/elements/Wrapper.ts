import Element from './Element';
import TerminalBuffer from '../buffers/TerminalBuffer';
import {EventEmitter} from 'events';

/**
 * A simple base class, to extend another element (add a border, position an element etc.)
 * It passes through all of the child state as well as all the method calls
 */
export default class Wrapper extends Element {
	constructor(protected child: Element) {
		super();

		this.child.on('blur', () => this.emit('blur'));
		this.child.on('focus', () => this.emit('focus'));
		this.child.on('change', () => this.emit('change'));
		this.child.on('focus-next', () => this.emit('focus-next'));
		this.child.on('focus-previous', () => this.emit('focus-previous'));
	}

	get hidden() {
		return this.child.hidden;
	}

	set hidden(hidden: boolean) {
		/* Condition neccessary because this is set in the constructor super() call */
		if(this.child) this.child.hidden = hidden;
	}

	get locked() {
		return this.child.locked;
	}

	set locked(locked: boolean) {
		if(this.child) this.child.locked = locked;
	}

	get focussed() {
		return this.child.focussed;
	}

	get focussable() {
		return this.child.focussable;
	}

	focus() {
		this.child.focus();
	}

	focusFirst() {
		this.child.focusFirst();
	}

	focusLast() {
		this.child.focusLast();
	}

	blur() {
		this.child.blur();
	}

	/** By default simply render the child, aka do nothing */
	render(buffer: TerminalBuffer) {
		this.child.render(buffer);
	}
}
