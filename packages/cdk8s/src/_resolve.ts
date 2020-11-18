import { Lazy } from './lazy';

export function resolve(value: any): any {

  if (value == null) {
    return value;
  }

  // cdk8s token
  if (value instanceof Lazy) {
    const resolved = value.produce();
    return resolve(resolved);
  }

  // implicit token as generated by the cdk8s-cli (e.g IntOrString)
  if (typeof(value.resolve) === 'function') {
    const resolved = value.resolve();
    return resolve(resolved);
  }

  if (typeof(value) !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(x => resolve(x));
  }

  const result: any = {};

  for (const [k, v] of Object.entries(value)) {
    result[k] = resolve(v);
  }

  return result;

}