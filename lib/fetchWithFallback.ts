export async function fetchWithFallback<T>(
  client: { fetch: <R>(q: string, p?: Record<string, unknown>) => Promise<R> },
  query: string,
  params: Record<string, unknown>,
  fallback: T,
): Promise<T> {
  const data = (await client.fetch<T | null>(query, params)) as T | null
  return (data as T) ?? fallback
}


