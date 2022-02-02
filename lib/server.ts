import express from 'express';
import io from 'socket.io';
import http from 'http';

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

export default class Server {
	port = 80;
	app = express();
	http = http.createServer(this.app);
	socket: io.Server | undefined;
	wsEnabled = false;

	constructor(port?: number, opts?: {enableSocket?: boolean}) {
		port ? this.port = port : null;
		opts && opts.enableSocket ? this.enableSocket() : null;
	}

	start() {
		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}!`);
		});
	}

	addRoute(requestType: Method, route: string, callback: (req: express.Request, res: express.Response) => void) {
		this.app[requestType](route, callback);
	}

	getApp() {
		return this.app;
	}

	getServer() {
		return this.http;
	}

	getSocket() {
		return this.socket;
	}

	enableSocket() {
		this.socket = new io.Server(this.http);
		this.wsEnabled = true;
	}
}