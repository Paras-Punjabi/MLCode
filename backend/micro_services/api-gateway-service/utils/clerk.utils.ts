import clerkClient from '../../configs/clerk.config';
import http from 'http';
import { parseCookie } from 'cookie';

function incomingMessagetoWebRequest(req: http.IncomingMessage): Request {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
  const host = req.headers.host;

  const url = `${proto}://${host}${req.url}`;
  return new Request(url, {
    method: req.method,
    headers: req.headers as any,
  });
}

export async function verifySession(req: http.IncomingMessage) {
  try {
    // const cookies = parseCookie(req.headers.cookie as string);
    // const sessionId = cookies.clerk_active_context;
    // const session = await clerkClient.sessions.getSession(
    //   sessionId.split(":")[0]
    // );

    const request = incomingMessagetoWebRequest(req);
    const session = await clerkClient.authenticateRequest(request);

    if (!session.isAuthenticated) {
      return {
        success: false,
        session: null,
        statusCode: 401,
        message: 'Session is not active or valid',
      };
    }
    return {
      success: true,
      session,
      statusCode: 200,
      message: 'Session is active and valid',
    };
  } catch (err) {
    return {
      success: false,
      statusCode: 401,
      session: null,
      error: err,
      message: 'Invalid Session',
    };
  }
}
