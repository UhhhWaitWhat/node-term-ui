import TerminalBuffer from '../buffers/TerminalBuffer';
import {EventEmitter} from 'events';

/**
 * The base UI Element, which all the other elements should extend
 * The main purpose of this base class is to implement globally consistent focus handling
 * The currently focussed event receives all key events.
 * It may then emit a series of focus events to communicate its desire, to receive focus or to pass it on
 * The parent then figures out, which element should actually receive focus and calls the corresponding methods on its children.
 */
export default class Element extends EventEmitter {
	/* Override these, to use our keys to shift focus */
	static nextFocus: string = 'TAB';
	static previousFocus: string = 'SHIFT_TAB';


	/**
	 * The currently focussed descendant.
	 * If this.focussed === this, we are the currently focussed element
	 */
	public focussed: Element = null;
	/** Is the focus trapped inside the element? */
	public locked: boolean = false;
	/** Is the element hidden? */
	public hidden: boolean = false;

	private manualFocussable: boolean = false;

	constructor() {
		super();

		/* Emit the corresponding focus event if we receive an input */
		this.on(Element.nextFocus, () => { if(!this.locked) this.emit('focus-next'); });
		this.on(Element.previousFocus, () => { if(!this.locked) this.emit('focus-previous'); });

		/* Reemit key events on their own  */
		this.on('key', (key: string) => this.emit(key));
	}

	/** Should it be possible to focus this element? */
	get focussable() {
		return !this.hidden && this.manualFocussable;
	}

	set focussable(flag: boolean) {
		this.manualFocussable = flag;
	}

	/**
	 * The core method, which defines what the elements puts onto the screen
	 * The passed buffer already has dimensions assigned to it.
	 * Should be implemented by extending class
	 */
	render(buffer: TerminalBuffer) {
		/* yes, this comment is here, to make tslint happy */
	}

	/**
	 * We received focus from somewhere
	 * This method is to be overriden, to do something upon receiving focus
	 * If you want to give an element focus, emit a 'focus' event from it.
	 */
	focus() {
		if(!this.focussable) throw new Error('Not Focussable!');

		this.focussed = this;
	}

	/**
	 * We received focus and should pass it on to our first child.
	 * If we have no child, we may keep the focus on us
	 */
	focusFirst() {
		this.focus();
	}

	/**
	 * We received focus and should pass it on to our lasst child.
	 * If we have no child, we may keep the focus on us
	 */
	focusLast() {
		this.focus();
	}

	/**
	 * We lost focus
	 */
	blur() {
		this.focussed = null;
	}
}
