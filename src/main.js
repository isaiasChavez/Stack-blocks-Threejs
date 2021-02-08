import { App } from './App';
import Observer, { EVENTS } from './Observer';

const container = document.querySelector('#game-container')

const app = new App(container);

window.addEventListener('resize', () => {
	app.onResize();
} );
container.addEventListener( 'click', () => {
	Observer.emit(EVENTS.CLICK)
} )
container.addEventListener( 'mousemove', (event) => {
	Observer.emit(EVENTS.MOUSE_MOVE,event)
}, false)

