# Element
Elements are the basic building blocks of your application. Each view of your application is a single element.
To create an element, you extend a base `Element` and override its `.render()` method. This should give a great deal of flexibility in creating elements. The only thing, that is handled by default is keeping track of element focus. To make all of this work properly, you have two additional, extendable classes `Wrapper`, to wrap a single element and `MultiWrapper`, to wrap multiple elements.

## [Element](../src/elements/Element.ts)
```ts
let e:Element
```
The base class for all elements.
Extend this class, to create a simple, self-contained Widget.

### Static Properties
```ts
Element.nextFocus:string = 'TAB'
```
The global key, used to focus the next item..
May be overriden.

```ts
Element.previousFocus:string = 'SHIFT_TAB'
```
The global key, used to focus the previous item. Defaults to `SHIFT_TAB`.
May be overriden.

### Instance Properties
```ts
e.focussed:Element = null
```
The descendant, which currently is focussed. Should be `null` if nothing is focussed. Should be the element itself if the focus chain should stop here.
Understand focus management before messing with this!

```ts
e.locked:boolean = false
```
Should focus loop around inside this element or can it break out into sibling/parent elements?
May be overriden.

```ts
e.hidden:boolean = false
```
Should this element be skipped in render passes? If you call the `render()` function on a child manually, you should check this flag first.
May be overriden.

```ts
e.focussable:boolean
```
May this element receive focus? This is implemented as a set of getter and setter functions by default. Unless you override this, even if you set `e.focussable = true`, if your element is hidden, it will not be focussable.

### Methods
```ts
e.focus():void
```
Called when an element receives focus. Override to do something upon receiving focus. By default it sets the `focussed` property.

```ts
e.focusFirst():void
```
When called, our first child should be focussed. By default just focusses ourselves, as we have no children.

```ts
e.focusLast():void
```
When called, our last child should be focussed. By default just focusses ourselves, as we have no children.

```ts
e.blur():void
```
Called when we loose focus. By default just resets `focussed` property.

```ts
e.render(buffer:TerminalBuffer):void
```
The meat of the element, so to speak. This method is called on each render pass. Simply do with the buffer as you please.

### Events
In addition to the [focus events](Focus.md#The_focus_events) the **key** event is emitted on key press (only on the currently focussed element) with the key identifier as its only parameter. The key identifiers themselves are also emitted for convenience.

## [Wrapper](../src/elements/Wrapper.ts)
A simple base class to wrap another element. It extends `Element` and proxies all properties, events and methods of a single child element.

### Constructor
```ts
let child = new Element();
let wrapper = new Wrapper(child);
```
Assigns the child to `this.child` and attaches all handlers etc.

### Usage
You may override e.g. the `render()` method, to modify the buffer before rendering the child:

```ts
class OffsetOneLeft extends Wrapper {
	render(buffer:TerminalBuffer) {
		let childBuffer = new TerminalBufferView(buffer, {x: 1});
		this.child.render(childBuffer);
	}
}
```


## [MultiWrapper](../src/elements/MultiWrapper.ts)
A base class which takes an array of children and takes care of focus handling between them. You should extend this to implement container elements.

### Constructor
```ts
let children = [new Element(), new Element()];
let mwrapper = new MultiWrapper(children);
```
Assigns the children array to `this.children` and attaches all handlers etc.

### Usage
Again, you may override render (or whatever you like, if you feel you got a firm grasp on the workings) to achieve e.g. a 50/50 split:

```ts
class Split extends MultiWrapper {
	constructor(left:Element, right:Element) {
		super([left, right]);
	}

	render(buffer:TerminalBuffer) {
		let leftBuffer = new TerminalBufferView(buffer, {width: '50%'});
		let rightBuffer = new TerminalBufferView(buffer, {left: '50%'});

		this.children[0].render(leftBuffer);
		this.children[1].render(rightBuffer);
	}
}
```
