import { injectSharedPagePartials, usesSharedPagePartial } from '../src/inject-contact.js';

export const onRequest = async (context) => {
  const pathname = new URL(context.request.url).pathname;
  const response = await context.next();
  if (context.request.method !== 'GET' || !usesSharedPagePartial(pathname)) return response;
  return injectSharedPagePartials(response, pathname);
};
