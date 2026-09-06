// Narrow historical LanguageModelV3 workaround. No finish/result is manufactured.
export function ensureStreamStart(model) {
  const original = model.doStream.bind(model);
  return new Proxy(model, {
    get(target, key, receiver) {
      if (key === 'doStream') return async (options) => {
        const result = await original(options);
        let first = true;
        const stream = result.stream.pipeThrough(new TransformStream({
          transform(part, controller) {
            if (first && part.type !== 'stream-start') {
              controller.enqueue({ type: 'stream-start', warnings: [] });
            }
            first = false;
            controller.enqueue(part);
          },
          // An empty stream remains empty: the consumer must still reject it.
        }));
        return { ...result, stream };
      };
      const value = Reflect.get(target, key, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}
