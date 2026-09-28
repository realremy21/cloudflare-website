import { injectContactSection, usesContactPartial } from '../src/inject-contact.js';

export const onRequest = async (context) => {
  const pathname = new URL(context.request.url).pathname;
  const response = await context.next();
  if (context.request.method !== 'GET' || !usesContactPartial(pathname)) return response;
  return injectContactSection(response, pathname);
};
