import configHandler from '../api/config.js';
import llmHandler from '../api/llm.js';

function response() {
  return {
    code: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

{
  const req = { method: 'GET', headers: {} };
  const res = response();
  configHandler(req, res);
  if (res.code !== 200 || typeof res.body?.needsCode !== 'boolean') throw new Error('Config route smoke test failed');
}

{
  const req = { method: 'GET', headers: {}, socket: {} };
  const res = response();
  await llmHandler(req, res);
  if (res.code !== 405) throw new Error('LLM method guard smoke test failed');
}

{
  const req = { method: 'POST', headers: {}, socket: {}, body: { prompt: 'not an app prompt' } };
  const res = response();
  await llmHandler(req, res);
  if (res.code !== 400) throw new Error('LLM request validation smoke test failed');
}

console.log('API smoke tests OK.');
