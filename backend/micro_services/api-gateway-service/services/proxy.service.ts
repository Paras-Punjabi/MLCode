import httpProxy from 'http-proxy';
import config from '../../configs/dotenv.config';

const { SERVICES } = config;

export const problemServiceProxyServer = httpProxy.createProxyServer({
  ws: true,
  target: SERVICES['problem-service'],
  changeOrigin: true,
});

export const submissionServiceProxyServer = httpProxy.createProxyServer({
  ws: true,
  target: SERVICES['submission-service'],
  changeOrigin: true,
});

export const containerServiceProxyServer = httpProxy.createProxyServer({
  ws: true,
  target: SERVICES['container-service'],
  changeOrigin: true,
});

export const notebookProxyServer = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: false,
});
