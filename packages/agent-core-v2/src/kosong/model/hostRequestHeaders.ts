/**
 * `kosong/model` domain (L2) — host-provided default headers for outbound
 * provider requests.
 *
 * Mirrors v1's `kimiRequestHeaders`: the host (CLI / server) builds the full
 * Kimi identity headers (`User-Agent` + `X-Msh-*`) through
 * `createKimiDefaultHeaders` and seeds them here. `ModelCatalog` merges them
 * per vendor — the full set for vendors whose definition declares
 * `hostHeaders: 'full'`, only the `User-Agent` for everyone else (so device
 * identity never leaks to third-party endpoints). Defaults to empty so
 * non-host contexts (tests, embedders) send no extra headers.
 */

import { createDecorator, type ServiceIdentifier } from '#/_base/di/instantiation';
import {
  LifecycleScope,
  ScopeActivation,
  registerScopedService,
  type ScopeSeed,
} from '#/_base/di/scope';

export interface IHostRequestHeaders {
  readonly headers: Readonly<Record<string, string>>;
}

export const IHostRequestHeaders = createDecorator<IHostRequestHeaders>('hostRequestHeaders');

const FIRST_PARTY_HOSTS = new Set(['api.moonshot.ai', 'api.moonshot.cn']);

export function isFirstPartyBaseUrl(baseUrl: string | undefined): boolean {
  if (baseUrl === undefined) return true;
  try {
    const url = new URL(baseUrl);
    return url.protocol === 'https:' && FIRST_PARTY_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export class HostRequestHeaders implements IHostRequestHeaders {
  constructor(readonly headers: Readonly<Record<string, string>> = {}) {}
}

export function hostRequestHeadersSeed(headers: Readonly<Record<string, string>>): ScopeSeed {
  return [[IHostRequestHeaders as ServiceIdentifier<unknown>, new HostRequestHeaders(headers)]];
}

registerScopedService(
  LifecycleScope.App,
  IHostRequestHeaders,
  HostRequestHeaders,
  ScopeActivation.OnScopeCreated,
  'model',
);
