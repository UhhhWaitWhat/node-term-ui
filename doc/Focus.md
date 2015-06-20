# Focus handling
The focus handling of this library follows a couple simple rules:

1. A single element is focussed at a time.
2. Each element provides a set of methods to position the focus below it.
3. Each element is responsible for handling its childrens focus.

If you simply extend the `Element`, `Wrapper` and `MultiWrapper` classes and do not modify their `focus()`, `blur()`, `focusFirst()` and  `focusLast()` methods, this should give you a working system in which you can use `TAB` and `SHIFT_TAB` to move the focus around reliably.

## The focus chain
Each element exposes a `focussed` property, which the application uses to determine which element to send keypresses to. If an element contains children, the containers `focussed` property should be equal to the `focussed` property of the currently focussed child. Internally we use getters to achieve this.

## The `focus()` and `blur()` methods
The only two methods which are strictly required by the `TerminalApplication` are focus and blur. Because each view is represented by a single top-level element, the `TerminalApplication` will call `focus()` when loading a view and `blur()` when closing it.

## The `focusFirst()` and `focusLast()` methods
To allow proper focussing across sibling containers, a container element needs to be able to focus the first or last element of a child container.

## The focus events
Because focus handling is the responsibility of container elements, our children need to be able to communicate a desire to receive or loose focus. Therefore they may emit events, which may be caught and interpreted by the parent. By default we define the following events:

* `focus`: Child would like to receive focus
* `blur`: Child would like to loose focus
* `focus-next`: Child would like to have its next sibling focussed
* `focus-previous`: Child would like to shift focus to its previous sibling

## Unfocussable and locked elements
Because not all elements should be able to be focussed, each element should provide a `focussable` property. This flag should then be honored by the parent. Also, each element should honor its own `locked` property. If it is true, it should **not** emit the `focus-next` and `focus-previous` events and instead loop its own focus around. This property is set by `TerminalApplication` on each view.

## Fitting it all together
The main work of tieing all of this into an intuitive and working-as-expected focus system is done inside the `MultiWrapper` class, the base class for all containers. If you should decide not to use it as the base of your container, just be aware, that you may have to implement your own focus handling.
