import http from 'http';
import expressApp from './expressApp';
import { verifySession } from './utils/clerk.utils';
import { notebookProxyServer } from './services/proxy.service';

const server = http.createServer();

server.on(
  'request',
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url?.startsWith('/notebook')) {
      const reqURLArray = req.url.split('/');
      const authResponse = await verifySession(req);

      if (authResponse.success && reqURLArray.length >= 2) {
        const sessionId = reqURLArray[2];
        notebookProxyServer.web(req, res, {
          target: 'http://localhost:8888', // `http://notebook-service-${sessionId}:8888`
        });
      } else {
        res.writeHead(authResponse.statusCode, {
          'Content-Type': 'text/plain',
        });
        res.write(JSON.stringify(authResponse));
        res.end();
      }
    } else {
      expressApp(req, res);
    }
  }
);

server.on('upgrade', async (req, socket, head) => {
  if (req.url?.startsWith('/notebook')) {
    const reqURLArray = req.url.split('/');
    const { success } = await verifySession(req);

    if (success && reqURLArray.length >= 2) {
      const sessionId = reqURLArray[2];
      notebookProxyServer.ws(req, socket, head, {
        target: 'http://localhost:8888', // `http://notebook-service-${sessionId}:8888`
      });
    } else {
      socket.destroy();
    }
  }
});

export default server;
