import {RemixServer} from '@remix-run/react';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from '@shopify/remix-oxygen';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://alisonoct.ngrok.io',
      'https://cdn.shopify.com',
      'https://shopify.com',
    ],
    connectSrc: ['*', 'https://alisonoct.ngrok.io'],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      'https://alisonoct.ngrok.io',
      'https://cdn.shopify.com',
      'https://shopify.com',
    ],
    imgSrc: ['*', 'data:*'],
  });

  console.log(header);
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
