import Server from './lib/server';
import {Doc, El, Link} from './lib/classes';

const doc = new Doc();

doc.setUseData(true);

doc.setUseWS(true);

doc.addCustomJS('https://cdn.tailwindcss.com', true);

const el = new El({type: 'button', content: 'Click me!'}).addID('aclickus');

const link = new Link().addManipulator(el, 'click');

doc.addEls([
	new El({type: 'h1', content: 'Hello, world!'}).addClasses(['text-3xl', 'font-bold', 'my-4']),
	new El({type: 'p', content: 'This is a paragraph.'}),
	new El({type: 'p', content: 'This is another paragraph.'}),
	el
]);

const data = [
	'This is very important!',
	'This is not as important!',
	'This is the least important!'
];

doc.addEls(data.map(content => new El({type: 'p', content})));

console.log(doc.getHTMLDocument('Testus Mogus'));

const app = new Server();

app.enableSocket();

app.addRoute('get', '/', (req, res) => {
	res.send(doc.getHTMLDocument('Testus Mogus'));
});

const socket = app.getSocket();

if(!socket) throw new Error('ARGH MACH DEN SOCKET AN!');

socket.on('connection', (socket) => {
	socket.on('message', (data) => {
		socket.emit('message', data);
	});
});

app.start();