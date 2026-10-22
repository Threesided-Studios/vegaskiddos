import test from 'node:test';
import assert from 'node:assert/strict';

test('translation preserves the JSON contract with a nonreasoning model', async () => {
  const previousFetch = globalThis.fetch;
  const previousModel = process.env.OPENAI_TRANSLATE_MODEL;
  delete process.env.OPENAI_TRANSLATE_MODEL;
  let calls = 0;
  try {
    globalThis.fetch = async (url, init) => {
      calls++;
      assert.equal(url, 'https://api.openai.com/v1/chat/completions');
      const body = JSON.parse(init.body);
      assert.equal(body.model, 'gpt-6-luna');
      assert.equal(body.reasoning_effort, 'none');
      assert.equal(body.temperature, 0.2);
      assert.deepEqual(body.response_format, { type: 'json_object' });
      assert.deepEqual(JSON.parse(body.messages[1].content), { items: [{ title: 'Storytime', description: 'At 10am, free.' }] });
      return Response.json({ choices: [{ message: { content: JSON.stringify({ items: [{ titleEs: 'Cuentacuentos', descriptionEs: 'A las 10am, gratis.' }] }) } }] });
    };
    const { translateBatch } = await import('./translate.mjs?model-test');
    assert.deepEqual(await translateBatch([{ title: 'Storytime', description: 'At 10am, free.' }], 'offline-test-only'), [{ titleEs: 'Cuentacuentos', descriptionEs: 'A las 10am, gratis.' }]);
    assert.equal(calls, 1);
    assert.deepEqual(await translateBatch([], 'offline-test-only'), []);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousModel === undefined) delete process.env.OPENAI_TRANSLATE_MODEL;
    else process.env.OPENAI_TRANSLATE_MODEL = previousModel;
  }
});
