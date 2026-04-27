import 'server-only';
import { PostHog } from 'posthog-node';

let _client: PostHog | null = null;

function getServerClient(): PostHog | null {
  if (_client) return _client;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) return null;

  _client = new PostHog(key, {
    host,
    flushAt: 1, // Flush every event (serverless-friendly)
    flushInterval: 0,
  });

  return _client;
}

/**
 * Track event from server (Server Actions, API routes, tRPC).
 *
 * @param distinctId — User ID or anonymous ID
 * @param event — Event name from event taxonomy
 * @param properties — Event properties
 */
export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const client = getServerClient();
  if (!client) return;

  client.capture({
    distinctId,
    event,
    properties,
  });

  // Ensure event sent before request finishes
  await client.shutdown();
  _client = null; // Reset for next request
}
