import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks — vi.hoisted ensures these are available when vi.mock factories run
// ---------------------------------------------------------------------------

const { mockFindUnique, mockUpdate, mockCompare, mockBcryptHash, mockLoginRateLimiter, mockGetClientIp } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockCompare: vi.fn(),
  mockBcryptHash: vi.fn(),
  mockLoginRateLimiter: vi.fn(),
  mockGetClientIp: vi.fn(() => '127.0.0.1'),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: mockCompare,
    hash: mockBcryptHash,
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  loginRateLimiter: mockLoginRateLimiter,
  getClientIp: mockGetClientIp,
}));

vi.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: () => ({}),
}));

// Mock GoogleProvider to avoid loading real module
vi.mock('next-auth/providers/google', () => ({
  default: () => ({}),
}));

// CRITICAL: Mock CredentialsProvider to return the config object directly.
// The real CredentialsProvider wraps the authorize function in a way that
// bypasses our module mocks. By returning the config directly, our authorize
// function captures the mocked prisma, bcrypt, etc. from the hoisted mocks.
vi.mock('next-auth/providers/credentials', () => ({
  default: (config: Record<string, unknown>) => ({
    ...config,
    type: 'credentials',
  }),
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { authOptions } from '@/lib/auth';

// Extract the authorize function from the credentials provider
function getAuthorizeFn() {
  const provider = authOptions.providers.find(
    (p) => {
      const prov = p as Record<string, unknown>;
      return prov.type === 'credentials' || typeof prov.authorize === 'function';
    }
  );
  return (provider as { authorize: (...args: unknown[]) => Promise<unknown> }).authorize;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  image: null,
  password: '$2a$12$hashedpassword',
  role: 'customer',
  loginAttempts: 0,
  lockedUntil: null,
};

function makeReq(headers?: Record<string, string>) {
  return { headers: new Headers(headers) };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Auth — Credentials Provider authorize()', () => {
  let authorize: (...args: unknown[]) => Promise<unknown>;

  beforeEach(() => {
    vi.clearAllMocks();
    authorize = getAuthorizeFn();

    // Default: rate limiter allows
    mockLoginRateLimiter.mockReturnValue({
      success: true,
      remaining: 4,
      resetTime: Date.now() + 15 * 60 * 1000,
    });
  });

  // -------------------------------------------------------------------------
  // Valid credentials should succeed
  // -------------------------------------------------------------------------
  it('should return user on valid credentials', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });
    mockCompare.mockResolvedValue(true);

    const result = await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq()
    );

    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      image: null,
      role: 'customer',
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(mockCompare).toHaveBeenCalledWith('Password123', '$2a$12$hashedpassword');
  });

  // -------------------------------------------------------------------------
  // Invalid password should fail
  // -------------------------------------------------------------------------
  it('should return null on invalid password', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });
    mockCompare.mockResolvedValue(false);

    const result = await authorize(
      { email: 'test@example.com', password: 'WrongPassword' },
      makeReq()
    );

    expect(result).toBeNull();
    // Should increment loginAttempts
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { loginAttempts: 1 },
    });
  });

  // -------------------------------------------------------------------------
  // Non-existent email should fail (do NOT reveal whether email exists)
  // -------------------------------------------------------------------------
  it('should return null for non-existent email without revealing existence', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await authorize(
      { email: 'nonexistent@example.com', password: 'Password123' },
      makeReq()
    );

    expect(result).toBeNull();
    // Should NOT call update for a non-existent user
    expect(mockUpdate).not.toHaveBeenCalled();
    // Should NOT call bcrypt.compare (avoids timing attacks on email existence)
    expect(mockCompare).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Missing credentials should return null
  // -------------------------------------------------------------------------
  it('should return null when email is missing', async () => {
    const result = await authorize(
      { email: '', password: 'Password123' },
      makeReq()
    );

    expect(result).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('should return null when password is missing', async () => {
    const result = await authorize(
      { email: 'test@example.com', password: '' },
      makeReq()
    );

    expect(result).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Account lockout after 5 failed attempts
  // -------------------------------------------------------------------------
  it('should lock account after 5 failed attempts', async () => {
    const userWith4Attempts = { ...mockUser, loginAttempts: 4 };
    mockFindUnique.mockResolvedValue(userWith4Attempts);
    mockCompare.mockResolvedValue(false);

    await authorize(
      { email: 'test@example.com', password: 'WrongPassword' },
      makeReq()
    );

    // 5th failed attempt should lock the account
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: {
        loginAttempts: 5,
        lockedUntil: expect.any(Date),
      },
    });

    // lockedUntil should be ~15 minutes in the future
    const updateCall = mockUpdate.mock.calls[0][0] as { data: { lockedUntil: Date } };
    const lockedUntil = updateCall.data.lockedUntil.getTime();
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    // Allow 5 seconds of tolerance
    expect(lockedUntil).toBeGreaterThan(now + fifteenMinutes - 5000);
    expect(lockedUntil).toBeLessThan(now + fifteenMinutes + 5000);
  });

  it('should increment loginAttempts on each failed attempt (before lockout)', async () => {
    const userWith2Attempts = { ...mockUser, loginAttempts: 2 };
    mockFindUnique.mockResolvedValue(userWith2Attempts);
    mockCompare.mockResolvedValue(false);

    await authorize(
      { email: 'test@example.com', password: 'WrongPassword' },
      makeReq()
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { loginAttempts: 3 },
    });
  });

  it('should deny login when account is locked (lockedUntil is in the future)', async () => {
    const lockedUser = {
      ...mockUser,
      loginAttempts: 5,
      lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 min in future
    };
    mockFindUnique.mockResolvedValue(lockedUser);

    const result = await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq()
    );

    expect(result).toBeNull();
    // Should NOT attempt password comparison for locked accounts
    expect(mockCompare).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Successful login resets loginAttempts and lockedUntil
  // -------------------------------------------------------------------------
  it('should reset loginAttempts and lockedUntil on successful login', async () => {
    const userWithAttempts = { ...mockUser, loginAttempts: 3, lockedUntil: null };
    mockFindUnique.mockResolvedValue(userWithAttempts);
    mockCompare.mockResolvedValue(true);

    const result = await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq()
    );

    expect(result).not.toBeNull();
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { loginAttempts: 0, lockedUntil: null },
    });
  });

  it('should reset loginAttempts and lockedUntil even if previously locked (expired lock)', async () => {
    const userWithExpiredLock = {
      ...mockUser,
      loginAttempts: 5,
      lockedUntil: new Date(Date.now() - 1000), // expired 1 second ago
    };
    mockFindUnique.mockResolvedValue(userWithExpiredLock);
    mockCompare.mockResolvedValue(true);

    const result = await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq()
    );

    expect(result).not.toBeNull();
    // Should have reset attempts (called twice: once for expired lock, once for success)
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  it('should NOT update user if loginAttempts is 0 and no lockout on success', async () => {
    const cleanUser = { ...mockUser, loginAttempts: 0, lockedUntil: null };
    mockFindUnique.mockResolvedValue(cleanUser);
    mockCompare.mockResolvedValue(true);

    await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq()
    );

    // No update needed — user is already clean
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Rate limiting
  // -------------------------------------------------------------------------
  it('should throw an error when rate limit is exceeded', async () => {
    mockLoginRateLimiter.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 10 * 60 * 1000,
    });

    await expect(
      authorize(
        { email: 'test@example.com', password: 'Password123' },
        makeReq()
      )
    ).rejects.toThrow('Too many login attempts');

    // Should NOT query the database when rate limited
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('should extract client IP from request headers for rate limiting', async () => {
    mockFindUnique.mockResolvedValue({ ...mockUser });
    mockCompare.mockResolvedValue(true);

    await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq({ 'x-forwarded-for': '203.0.113.1' })
    );

    expect(mockGetClientIp).toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // User with no password (OAuth-only user)
  // -------------------------------------------------------------------------
  it('should return null for users without a password (OAuth-only)', async () => {
    const oauthUser = { ...mockUser, password: null };
    mockFindUnique.mockResolvedValue(oauthUser);

    const result = await authorize(
      { email: 'test@example.com', password: 'Password123' },
      makeReq()
    );

    expect(result).toBeNull();
    expect(mockCompare).not.toHaveBeenCalled();
  });
});
