interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export function cachedFetch<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > Date.now()) {
    return Promise.resolve(entry.data);
  }

  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fetcher()
    .then((data) => {
      cache.set(key, { expiresAt: Date.now() + ttlMs, data });
      inflight.delete(key);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}

export function invalidate(keyPrefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) cache.delete(key);
  }
}

export function invalidateAll(): void {
  cache.clear();
}

// Targeted invalidation helpers
export const clearTeamsCache = () => invalidate("teams");
export const clearPlayersCache = () => invalidate("playersByTeam");
export const clearScheduleCache = () => {
  invalidate("scheduleFull");
  invalidate("scheduleUpcoming");
  invalidate("scheduleRecent");
};
export const clearStaffCache = () => {
  invalidate("publicStaff");
  invalidate("publicStaffMember");
};
export const clearAllCache = invalidateAll;
