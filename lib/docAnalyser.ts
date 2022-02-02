import type { Doc } from './classes';
import type Server from './server';

export default function analyzeDocuments(documents: Doc[], server: Server) {
	const port = server.port;
	documents.forEach(doc => {
		if(server.wsEnabled) doc.setUseWS(true).setWSPort(port);
	});
}