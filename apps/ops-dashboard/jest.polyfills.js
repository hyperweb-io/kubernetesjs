/* eslint-disable @typescript-eslint/no-require-imports */
// jest.polyfills.js


const {
  TextDecoder, TextEncoder,
} = require('node:util');
 
const { ReadableStream, TransformStream } = require('node:stream/web');
 
const { BroadcastChannel, MessagePort } = require('node:worker_threads');

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  BroadcastChannel: { value: BroadcastChannel },
  MessagePort:{value:MessagePort}
});

const {
  Blob, File,
} = require('node:buffer');

// Use whatwg-fetch instead of undici for better MSW compatibility
const { fetch, Headers, Request, Response } = require('whatwg-fetch');

// Add markResourceTiming polyfill for compatibility
globalThis.markResourceTiming = globalThis.markResourceTiming || (() => {});

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
  Blob,
  File,
});