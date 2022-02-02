export class DocGroup {
	constructor() {
		return this;
	}

	docs: Doc[] = [];

	getDocs() {
		return this.docs;
	}

	addDoc(doc: Doc) {
		this.docs.push(doc);
		return this;
	}
}

export class El {
	type: string;
	content: string;
	classes: string[] = [];
	ids: string[] = [];

	constructor(element: {type: string, content: string, classList?: string[], idList?: string[]})  {
		this.type = element.type;
		this.content = element.content;
		element.classList ? this.classes = element.classList : null;
		element.idList ? this.ids = element.idList : null;
		return this;
	}

	addClass(className: string) {
		this.classes.push(className);
		return this;
	}

	addClasses(classes: string[]) {
		this.classes = [...this.classes, ...classes];
		return this;
	}

	addID(idName: string) {
		this.classes.push(idName);
		return this;
	}

	addIDs(ids: string[]) {
		this.ids = [...this.ids, ...ids];
		return this;
	}

	getHTML(): string {
		return `<${this.type} class="${arrayToStr(this.classes, ' ')}">${this.content}</${this.type}>`;
	}

	getType(): string {
		return this.type;
	}

	getContent(): string {
		return this.content;
	}

	updateContent(content: string) {
		if(this.ids.length < 1) throw new Error('No ID set for this element! THis is required for manipulation after on.');
		this.content = content;
		return this;
	}
}

type DOMEvent = keyof DocumentEventMap;

type Manipulator = {
	el: El,
	event: DOMEvent
}

export class Link {
	constructor() {
		return this;
	}

	manipulators: Manipulator[] = [];
	manipulated: El[] = [];

	addManipulator(manipulator: El, event: DOMEvent) {
		if(manipulator.ids.length < 1) throw new Error('A link manipulator must have an ID!');
		
		this.manipulators.push({el: manipulator, event});
		return this;
	}

	addManipulated(el: El) {
		if(el.ids.length < 1) throw new Error('An manipulated element must have an ID!');
		this.manipulated.push(el);
	}
}

export class Doc {
	constructor() {
		return this;
	}

	elements: Array<El> = [];

	css: Array<string> = [];
	js: Array<string> = [];
	useData = false; //if false, the page will be static
	useWS = false; //Useful when creating chat app
	port = 80;

	setWSPort(port: number) {
		this.port = port;
		return this;
	}

	setUseData(useData: boolean): void {
		useData ? this.useData = useData : null;
	}

	setUseWS(useWS: boolean) {
		useWS ? this.useWS = useWS : null;
		return this;
	}
	
	addCustomCSS(location: string): void {
		const defaultElement = '<link rel="stylesheet" href="{{stylesheet}}">';
		this.css.push(defaultElement.replace('{{stylesheet}}', location));
	}

	addCustomJS(location: string, loadBeforePage = false): void {
		const defaultElement = '<script src="{{js}}" {{defer}}></script>';
		let newEl = defaultElement.replace('{{js}}', location);
		if(loadBeforePage == false) newEl = newEl.replace('{{defer}}', 'defer');
		else newEl = newEl.replace('{{defer}}', '');
		this.js.push(newEl);
	}

	addEl(element: El): void {
		this.elements.push(element);
	}
	
	addEls(elements: Array<El>): void {
		this.elements = [...this.elements, ...elements];
	}

	getEls(): Array<El> {
		return this.elements;
	}

	getHTML(): string {
		let html = '';
		for (let i = 0; i < this.elements.length; i++) {
			html += `${this.elements[i].getHTML()}\n`;
		}
		return html;
	}

	getHTMLDocument(title: string): string {
		const skeleton = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>{{title}}</title>
	{{customAdditions}}
</head>
<body>
{{content}}
</body>
</html>
		`;

		const customAdditions = arrayToStr(this.css, '\n') + arrayToStr(this.js, '\n');

		let htmlDoc = skeleton.replace('{{title}}', title);

		htmlDoc = htmlDoc.replace('{{customAdditions}}', customAdditions);

		htmlDoc = htmlDoc.replace('{{content}}', formatDoc(this));

		return htmlDoc;
	}
}

function formatEl(input: El): string {
	return `	${input.getHTML()}`;
}

function formatDoc(input: Doc): string {
	return arrayToStr(input.getEls().map(formatEl), '\n');
}

function arrayToStr(input: Array<string>, seperator = '') {
	let output = '';
	for (let i = 0; i < input.length; i++) {
		output += input[i];
		output += seperator;
	}
	return output;
}