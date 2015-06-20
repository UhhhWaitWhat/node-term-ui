import Element from './Element';
import {EventEmitter} from 'events';

/**
 * A base class to work with collections of elements
 * Focus will skip over any hidden or unfocussable elements.
 * If the element is locked, the focus will loop around.
 */
export default class MultiWrapper extends Element {
	private focussedChild: Element = null;

	/** If we have anything which should be focussed, pass it through */
	get focussed() {
		return this.focussedChild ? this.focussedChild.focussed : null;
	}

	/** If we have at least one focussable child, we can be focussed as well */
	get focussable() {
		return this.children.filter(child => child.focussable).length > 0 && !this.hidden;
	}

	constructor(protected children: Array<Element>) {
		super();

		this.prepareChildren(children);
	}

	prepareChildren(children: Array<Element>) {
		children.forEach((child) => {
			/* Rerender whenever a non-hidden child changes */
			child.on('change', () => {
				if(!child.hidden) this.emit('change');
			});

			/* Handle focussing */
			child.on('blur', () => this.blurChild(child))
			child.on('focus', () => this.focusChild(child));
			child.on('focus-next', () => this.focusNext());
			child.on('focus-previous', () => this.focusPrevious());
		});
	}

	focus() {
		if(!this.focussable) throw new Error('Not Focussable!');

		/* If nothing has focus, focus the first thing we can. */
		if(this.focussedChild) {
			this.focussedChild.focus();
		} else {
			this.focusFirst();
		}
	}

	focusFirst() {
		if(!this.focussable) throw new Error('Not Focussable!');

		this.blur();
		this.focussedChild = this.children.filter(child => child.focussable)[0];
		if(this.focussedChild) this.focussedChild.focusFirst();
	}

	focusLast() {
		if(!this.focussable) throw new Error('Not Focussable!');
		let children = this.children.filter(child => child.focussable);

		this.blur();
		this.focussedChild = children[children.length - 1];
		if(this.focussedChild) this.focussedChild.focusLast();
	}

	blur() {
		if(this.focussedChild) this.focussedChild.blur();
	}

	/**
	 * Focus the next focussable child
	 * If none is available, either loop around or focus our next sibling, depending on our lock status.
	 */
	focusNext() {
		if(!this.focussable && this.locked) throw new Error('No focussable elements');
		let position = this.children.indexOf(this.focussedChild) + 1;

		while(position >= this.children.length || !this.children[position].focussable) {
			if(position < this.children.length) {
				position++;
			} else if(this.locked) {
				position = 0;
			} else {
				this.blur();
				this.emit('focus-next');
				return;
			}
		}

		this.blur();
		this.focussedChild = this.children[position];
		this.focussedChild.focusFirst();
		this.emit('focus');
	}

	/**
	* Focus the previous focussable child
	* If none is available, either loop around or focus our previous sibling, depending on our lock status.
	*/
	focusPrevious() {
		if(!this.focussable && this.locked) throw new Error('No focussable elements');
		let position = this.children.indexOf(this.focussedChild) - 1;

		while(position < 0 || !this.children[position].focussable) {
			if(position >= 0) {
				position--;
			} else if(this.locked) {
				position = this.children.length - 1;
			} else {
				this.blur();
				this.emit('focus-previous');
				return;
			}
		}

		this.blur();
		this.focussedChild = this.children[position];
		this.focussedChild.focusLast();
		this.emit('focus');
	}

	focusChild(child: Element) {
		if(this.children.indexOf(child) === -1) throw new Error('Child not part of parent');

		if(this.focussedChild !== child) {
			this.blur();
			this.focussedChild = child;
		};

		this.focussedChild.focus();
		this.emit('focus');
	}

	blurChild(child: Element) {
		child.blur();

		if(child === this.focussedChild) {
			this.focusNext();
		}
	}
}
