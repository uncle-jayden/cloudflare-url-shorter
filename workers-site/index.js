import { Router } from 'itty-router';
import { customAlphabet } from 'nanoid';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const router = Router();
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
);

router.get('/:slug', async request => {
  let link = await SHORTEN.get(request.params.slug);

  if (link) {
    return new Response(null, {
      headers: { Location: link },
      status: 301,
    });
  } else {
    return new Response('Key not found', {
      status: 404,
    });
  }
});

router.post('/links', async request => {
  let slug = nanoid();
  let requestBody = await request.json();
  if ('url' in requestBody) {
    //Convert some special characters to ASCII. For example, convert 'https://中文.tw' to 'https://%E4%B8%AD%E6%96%87.tw'
    let inputURL = encodeURI(requestBody.url);
    try{
      new URL(inputURL);
    }
    catch{
      inputURL = 'https://' + inputURL;
    };
    // Add slug to our KV store so it can be retrieved later:
    await SHORTEN.put(slug, inputURL, { expirationTtl: 864000 });
    let shortenedURL = `${new URL(request.url).origin}/${slug}`;
    let responseBody = {
      message: 'Link shortened successfully',
      slug,
      shortened: shortenedURL,
    };
    return new Response(JSON.stringify(responseBody), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } else {
    return new Response("Must provide a valid URL", { status: 400 });
  }
});

async function handleEvent(event) {
  let requestUrl = new URL(event.request.url);
  if (requestUrl.pathname === '/' || requestUrl.pathname.includes('static')) {
    return await getAssetFromKV(event);
  } else {
    return await router.handle(event.request);
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});
