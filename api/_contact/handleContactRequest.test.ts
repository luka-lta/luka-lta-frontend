import { describe, expect, test } from 'bun:test';
import { issueChallengeToken, MAX_TOKEN_AGE_MS, MIN_FILL_TIME_MS } from './challengeToken.js';
import type { ContactSubmission } from './contactSubmission.js';
import {
  handleContactRequest,
  HONEYPOT_FIELD,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  type ContactDependencies,
  type ContactRequest,
} from './handleContactRequest.js';
import { RateLimiter } from './rateLimiter.js';

const SECRET = 'test-secret-not-used-anywhere-else';
const NOW = 1_800_000_000_000;
const SITE_HEADERS = {
  host: 'luka-lta.dev',
  origin: 'https://luka-lta.dev',
  'x-real-ip': '203.0.113.7',
};

interface Harness {
  dependencies: ContactDependencies;
  sentMails: ContactSubmission[];
  setNow: (now: number) => void;
}

function createHarness(): Harness {
  const sentMails: ContactSubmission[] = [];
  let currentTime = NOW;

  return {
    sentMails,
    setNow: (now) => {
      currentTime = now;
    },
    dependencies: {
      secret: SECRET,
      rateLimiter: new RateLimiter(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS),
      now: () => currentTime,
      sendMail: async (submission) => {
        sentMails.push(submission);
      },
    },
  };
}

/** Gültige Anfrage, deren Token `tokenAgeMs` vor dem Absenden ausgestellt wurde. */
function createPost(overrides: Record<string, unknown> = {}, tokenAgeMs: number = MIN_FILL_TIME_MS): ContactRequest {
  return {
    method: 'POST',
    headers: SITE_HEADERS,
    body: {
      name: 'Erika Mustermann',
      email: 'erika.mustermann@example.com',
      phone: '+49 30 1234567',
      message: 'Guten Tag, ich suche Unterstützung für einen neuen Onlineshop.',
      token: issueChallengeToken(SECRET, NOW - tokenAgeMs),
      ...overrides,
    },
  };
}

describe('handleContactRequest', () => {
  test('shouldSendMailOnValidSubmission', async () => {
    const harness = createHarness();

    const response = await handleContactRequest(createPost(), harness.dependencies);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.rejectionReason).toBeNull();
    expect(harness.sentMails).toEqual([{
      name: 'Erika Mustermann',
      email: 'erika.mustermann@example.com',
      phone: '+49 30 1234567',
      message: 'Guten Tag, ich suche Unterstützung für einen neuen Onlineshop.',
    }]);
  });

  test('shouldSendMailWhenOptionalPhoneAndHoneypotAreEmpty', async () => {
    const harness = createHarness();

    const response = await handleContactRequest(createPost({ phone: '', [HONEYPOT_FIELD]: '' }), harness.dependencies);

    expect(response.status).toBe(200);
    expect(harness.sentMails).toHaveLength(1);
    expect(harness.sentMails[0].phone).toBeUndefined();
  });

  test('shouldAcceptSubmissionSentThroughForwardedHost', async () => {
    const harness = createHarness();
    const request = createPost();
    request.headers = { ...SITE_HEADERS, host: 'internal.vercel.app', 'x-forwarded-host': 'luka-lta.dev' };

    const response = await handleContactRequest(request, harness.dependencies);

    expect(response.status).toBe(200);
    expect(harness.sentMails).toHaveLength(1);
  });

  test('shouldPretendSuccessWithoutSendingMailOnHoneypotHit', async () => {
    const harness = createHarness();

    const response = await handleContactRequest(
      createPost({ [HONEYPOT_FIELD]: 'https://spam.example' }),
      harness.dependencies,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.rejectionReason).toBe('honeypot');
    expect(harness.sentMails).toHaveLength(0);
  });

  test('shouldRejectSubmissionSentFasterThanMinimumFillTime', async () => {
    const harness = createHarness();

    const response = await handleContactRequest(createPost({}, MIN_FILL_TIME_MS - 1), harness.dependencies);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'challenge_failed' });
    expect(response.rejectionReason).toBe('challenge_too_fast');
    expect(harness.sentMails).toHaveLength(0);
  });

  test('shouldRejectExpiredToken', async () => {
    const harness = createHarness();

    const response = await handleContactRequest(createPost({}, MAX_TOKEN_AGE_MS + 1), harness.dependencies);

    expect(response.status).toBe(400);
    expect(response.rejectionReason).toBe('challenge_expired');
    expect(harness.sentMails).toHaveLength(0);
  });

  test.each([
    ['missing token', undefined, 'challenge_malformed'],
    ['client-made timestamp', String(NOW - MIN_FILL_TIME_MS), 'challenge_malformed'],
    ['token signed with another secret', issueChallengeToken('other-secret', NOW - MIN_FILL_TIME_MS), 'challenge_bad_signature'],
    ['backdated timestamp with foreign signature', `1.${issueChallengeToken(SECRET, NOW).split('.')[1]}`, 'challenge_bad_signature'],
  ])('shouldRejectForgedToken: %s', async (_label, token, expectedReason) => {
    const harness = createHarness();

    const response = await handleContactRequest(createPost({ token }), harness.dependencies);

    expect(response.status).toBe(400);
    expect(response.rejectionReason).toBe(expectedReason);
    expect(harness.sentMails).toHaveLength(0);
  });

  test.each([
    ['empty name', { name: '   ' }, 'name'],
    ['name with header injection', { name: 'Erika\r\nBcc: victim@example.com' }, 'name'],
    ['name with link', { name: 'Visit https://spam.example' }, 'name'],
    ['name too long', { name: 'a'.repeat(101) }, 'name'],
    ['name is not a string', { name: 42 }, 'name'],
    ['email without domain', { email: 'erika@' }, 'email'],
    ['email with second recipient', { email: 'erika@example.com, victim@example.com' }, 'email'],
    ['email with line break', { email: 'erika@example.com\nBcc: victim@example.com' }, 'email'],
    ['email with markup', { email: '<script>@example.com' }, 'email'],
    ['phone with letters', { phone: 'call me maybe' }, 'phone'],
    ['phone too short', { phone: '12345' }, 'phone'],
    ['phone is not a string', { phone: 491234567 }, 'phone'],
    ['message too short', { message: 'Hallo' }, 'message'],
    ['message too long', { message: 'a'.repeat(5001) }, 'message'],
    ['message with link flood', { message: 'https://spam.example '.repeat(6) }, 'message'],
    ['message missing', { message: undefined }, 'message'],
  ])('shouldRejectInvalidInput: %s', async (_label, overrides, expectedField) => {
    const harness = createHarness();

    const response = await handleContactRequest(createPost(overrides), harness.dependencies);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ error: 'invalid_input', fields: [expectedField] });
    expect(harness.sentMails).toHaveLength(0);
  });

  test.each([
    ['string body', 'name=Erika'],
    ['array body', []],
    ['missing body', undefined],
  ])('shouldRejectNonObjectBody: %s', async (_label, body) => {
    const harness = createHarness();

    const response = await handleContactRequest({ method: 'POST', headers: SITE_HEADERS, body }, harness.dependencies);

    expect(response.status).toBe(400);
    expect(harness.sentMails).toHaveLength(0);
  });

  test('shouldRejectOversizedBody', async () => {
    const harness = createHarness();
    const request = createPost();
    request.headers = { ...SITE_HEADERS, 'content-length': String(MAX_BODY_BYTES + 1) };

    const response = await handleContactRequest(request, harness.dependencies);

    expect(response.status).toBe(413);
    expect(harness.sentMails).toHaveLength(0);
  });

  test.each([
    ['foreign origin', { ...SITE_HEADERS, origin: 'https://evil.example' }],
    ['missing origin', { host: 'luka-lta.dev' }],
    ['unparsable origin', { ...SITE_HEADERS, origin: 'null' }],
  ])('shouldRejectCrossOriginSubmission: %s', async (_label, headers) => {
    const harness = createHarness();
    const request = createPost();
    request.headers = headers;

    const response = await handleContactRequest(request, harness.dependencies);

    expect(response.status).toBe(403);
    expect(harness.sentMails).toHaveLength(0);
  });

  test('shouldRejectRequestsAboveRateLimitWithRetryAfter', async () => {
    const harness = createHarness();
    for (let attempt = 0; attempt < RATE_LIMIT_MAX_REQUESTS; attempt++) {
      await handleContactRequest(createPost(), harness.dependencies);
    }

    const response = await handleContactRequest(createPost(), harness.dependencies);

    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: 'rate_limited' });
    expect(response.headers['Retry-After']).toBe(String(RATE_LIMIT_WINDOW_MS / 1000));
    expect(harness.sentMails).toHaveLength(RATE_LIMIT_MAX_REQUESTS);
  });

  test('shouldCountRejectedRequestsTowardsRateLimit', async () => {
    const harness = createHarness();
    for (let attempt = 0; attempt < RATE_LIMIT_MAX_REQUESTS; attempt++) {
      await handleContactRequest(createPost({ [HONEYPOT_FIELD]: 'bot' }), harness.dependencies);
    }

    const response = await handleContactRequest(createPost(), harness.dependencies);

    expect(response.status).toBe(429);
    expect(harness.sentMails).toHaveLength(0);
  });

  test('shouldLimitEachClientSeparately', async () => {
    const harness = createHarness();
    for (let attempt = 0; attempt <= RATE_LIMIT_MAX_REQUESTS; attempt++) {
      await handleContactRequest(createPost(), harness.dependencies);
    }
    const otherClient = createPost();
    otherClient.headers = { ...SITE_HEADERS, 'x-real-ip': '198.51.100.23' };

    const response = await handleContactRequest(otherClient, harness.dependencies);

    expect(response.status).toBe(200);
  });

  test('shouldAcceptRequestsAgainAfterRateLimitWindow', async () => {
    const harness = createHarness();
    for (let attempt = 0; attempt <= RATE_LIMIT_MAX_REQUESTS; attempt++) {
      await handleContactRequest(createPost(), harness.dependencies);
    }
    harness.setNow(NOW + RATE_LIMIT_WINDOW_MS);

    const response = await handleContactRequest(createPost({}, MIN_FILL_TIME_MS + RATE_LIMIT_WINDOW_MS), harness.dependencies);

    expect(response.status).toBe(200);
  });

  test('shouldIssueTokenThatIsAcceptedAfterMinimumFillTime', async () => {
    const harness = createHarness();

    const issued = await handleContactRequest({ method: 'GET', headers: SITE_HEADERS, body: undefined }, harness.dependencies);
    harness.setNow(NOW + MIN_FILL_TIME_MS);
    const request = createPost({ token: issued.body.token });
    const response = await handleContactRequest(request, harness.dependencies);

    expect(issued.status).toBe(200);
    expect(issued.headers['Cache-Control']).toBe('no-store');
    expect(issued.body.minFillTimeMs).toBe(MIN_FILL_TIME_MS);
    expect(response.status).toBe(200);
    expect(harness.sentMails).toHaveLength(1);
  });

  test('shouldRejectUnsupportedMethod', async () => {
    const harness = createHarness();

    const response = await handleContactRequest({ method: 'PUT', headers: SITE_HEADERS, body: {} }, harness.dependencies);

    expect(response.status).toBe(405);
    expect(response.headers.Allow).toBe('GET, POST');
  });

  test('shouldPropagateMailFailure', async () => {
    const harness = createHarness();
    harness.dependencies.sendMail = async () => {
      throw new Error('SMTP timeout');
    };

    const attempt = handleContactRequest(createPost(), harness.dependencies);

    await expect(attempt).rejects.toThrow('SMTP timeout');
  });
});
