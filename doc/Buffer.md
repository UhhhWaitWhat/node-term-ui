# TerminalBuffer
A TerminalBuffer represents a rectangular space into which characters can be rendered.
It is used to give a great deal of flexibility to the rendering process.

An interface definition can be found in [buffers/TerminalBuffer.ts](../src/buffers/TerminalBuffer.ts) and is exported as `TerminalBuffer`.
The basic idea is, that if you want to e.g. set a base style for a child element, instead of implementing this feature on the element itself, you simply pass it a TerminalBuffer which has this base style set. This allows us to very reliably reuse code by composing Elements.

## Methods and Attributes
```ts
let b:TerminalBuffer
```

```ts
b.width: number
b.height: number
```
The height and the width of the Buffer. Useful for calculating sizes relative to the buffer. Setting these values should resize the buffer.

```ts
b.clear(): void
```
Writes spaces into the entire buffer. Useful to fill a background.

```ts
b.put(x: number, y: number, char: string, styles?: Array<string>): void
```
Put a single character at position (x, y). Styles may be an array of strings corresponding to the styles provided by [ansi-styles](npm.org/packages/ansi-styles).
Coordinates may be out-of-bounds, and the specific implementation may decide what to do if they are.

```ts
b.get(x: number, y: number): string
```
Get a single character at position (x, y). Coordinates may be out-of-bounds.

```ts
b.write(x: number, y: number, text: string, styles?: Array<string>): void
```
Write a string of text at position(x, y). Lines should be broken at buffer boundaries (no word detection, might break mid-syllable).

## Implementations
### [TerminalBufferRoot](../src/buffers/TerminalBufferRoot.ts)
**Instantiate**:
```ts
let buffer = new TerminalBufferRoot({width: 10, height: 10});
```

The *base* implementation. Does exactly what is expected and nothing else. Stores data internally.
On a resize, any not longer existing positions are discarded.

### [TerminalBufferView](../src/buffers/TerminalBufferView.ts)
**Instantiate**:
```ts
let parent:TerminalBuffer;
let overflow:boolean = true;
let buffer = new TerminalBufferView(parent, {x: 0, y: 0, width: 12, height: 1}, overflow);
```
Represents a view into a parent buffer. This can be used to render an element into a part of a buffer. Any `.put()` and `.get()` operations are passed through to the parent buffer at the given offset. The `overflow` argument decides, if the element may spill characters across its bounds into the parent.

### [TerminalBufferWrapper](../src/buffers/TerminalBufferWrapper.ts)
A base class that should be extended to add a specializiation to a buffer. All property access and method calls are passed through to the parent unless overriden. An example extension to always set a given style on `.put()` might look like this:

```ts
class StyleBuffer extends TerminalBufferWrapper {
	constructor(private styles: Array<string>, parent: TerminalBuffer) {
		super(parent);
	}

	put(x: number, y: number, char: string) {
		this.parent.put(x, y, char, this.styles);
	}
}
```
