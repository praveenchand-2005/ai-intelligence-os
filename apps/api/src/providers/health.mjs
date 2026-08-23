import { providerRegistry } from './index.mjs';

export function providerHealth() {
  return providerRegistry.map(provider => ({ ...provider, checkedAt: new Date().toISOString() }));
}
