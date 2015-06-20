declare module 'terminal-kit' {
	import {EventEmitter} from 'events';

	class Terminal extends EventEmitter {
		width: number
		height: number
		moveTo(x: number, y: number, data: string): void
		fullscreen(toggle: boolean | {}): void
		hideCursor(toggle: boolean | {}): void
		windowTitle(name: string): void
		grabInput(toggle?: boolean | {}): void
		clear(): void
	}

	export var terminal: Terminal
}
