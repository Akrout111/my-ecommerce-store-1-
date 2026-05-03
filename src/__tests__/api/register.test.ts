import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Hoisted mocks — vi.hoisted ensures these are available when vi.mock factories run
// ---------------------------------------------------------------------------

const { mockFindUnique, mockCreate, mockBcryptHash, mockBcryptCompare, mockRegisterRateLimiter } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockCreate: vi.fn(),
  mockBcryptHash: vi.fn(),
  mockBcryptCompare: vi.fn(),
  mockRegisterRateLimiter: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare,
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  registerRateLimiter: Object.assign(mockRegisterRateLimiter, {
    config: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  }),
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { POST } from '@/app/api/auth/register/route';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: Record<string, unknown>, headers?: Record<string, string>) {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limiter allows
    mockRegisterRateLimiter.mockReturnValue({
      success: true,
      remaining: 2,
      resetTime: Date.now() + 60 * 60 * 1000,
    });
    // Also set up config mock on the function
    mockRegisterRateLimiter.config = {
      windowMs: 60 * 60 * 1000,
      maxRequests: 3,
    };

    // Default bcrypt hash
    mockBcryptHash.mockResolvedValue('$2a$12$hashednewpassword');
  });

  // -------------------------------------------------------------------------
  // Registration with valid data
  // -------------------------------------------------------------------------
  it('should create user with bcrypt-hashed password on valid data', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 'new-user-123',
      email: 'newuser@example.com',
      name: 'New User',
    });

    const request = makeRequest({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('newuser@example.com');

    // Verify bcrypt.hash was called with password and salt rounds
    expect(mockBcryptHash).toHaveBeenCalledWith('SecurePass123', 12);

    // Verify prisma.user.create was called with hashed password
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: 'New User',
        email: 'newuser@example.com',
        password: '$2a$12$hashednewpassword',
      },
      select: { id: true, email: true, name: true },
    });
  });

  it('should include rate limit headers on successful registration', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 'new-user-123',
      email: 'newuser@example.com',
      name: 'New User',
    });

    const request = makeRequest({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
    expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Registration with duplicate email
  // -------------------------------------------------------------------------
  it('should return 409 for duplicate email', async () => {
    mockFindUnique.mockResolvedValue({
      id: 'existing-user-123',
      email: 'existing@example.com',
      name: 'Existing User',
    });

    const request = makeRequest({
      name: 'Another User',
      email: 'existing@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('Email already in use');

    // Should NOT create a new user
    expect(mockCreate).not.toHaveBeenCalled();
    // Should NOT hash password
    expect(mockBcryptHash).not.toHaveBeenCalled();
  });

  it('should include rate limit headers on 409 response', async () => {
    mockFindUnique.mockResolvedValue({
      id: 'existing-user-123',
      email: 'existing@example.com',
    });

    const request = makeRequest({
      name: 'Another User',
      email: 'existing@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Registration with invalid input
  // -------------------------------------------------------------------------
  it('should return 400 for short password (< 8 chars)', async () => {
    const request = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'short',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();

    // Should have at least one issue about password length
    const passwordIssue = data.details.find(
      (issue: { path: string[] }) => issue.path.includes('password')
    );
    expect(passwordIssue).toBeDefined();
  });

  it('should return 400 for invalid email', async () => {
    const request = makeRequest({
      name: 'Test User',
      email: 'not-an-email',
      password: 'SecurePass123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');

    const emailIssue = data.details.find(
      (issue: { path: string[] }) => issue.path.includes('email')
    );
    expect(emailIssue).toBeDefined();
  });

  it('should return 400 for short name (< 2 chars)', async () => {
    const request = makeRequest({
      name: 'A',
      email: 'test@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');

    const nameIssue = data.details.find(
      (issue: { path: string[] }) => issue.path.includes('name')
    );
    expect(nameIssue).toBeDefined();
  });

  it('should return 400 with multiple validation errors for multiple invalid fields', async () => {
    const request = makeRequest({
      name: '',
      email: 'bad-email',
      password: 'sh',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details.length).toBeGreaterThanOrEqual(2);
  });

  it('should include rate limit headers on 400 response', async () => {
    const request = makeRequest({
      name: '',
      email: 'bad',
      password: 'sh',
    });

    const response = await POST(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Rate limiting
  // -------------------------------------------------------------------------
  it('should return 429 when rate limit is exceeded', async () => {
    mockRegisterRateLimiter.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 3600 * 1000,
    });

    const request = makeRequest(
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123',
      },
      { 'x-forwarded-for': '203.0.113.1' }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe('Too many requests');
    expect(data.retryAfter).toBeDefined();

    // Should NOT try to create user
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('should include Retry-After header on 429 response', async () => {
    mockRegisterRateLimiter.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 3600 * 1000,
    });

    const request = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);

    const retryAfterHeader = response.headers.get('Retry-After');
    expect(retryAfterHeader).toBeDefined();
    expect(Number(retryAfterHeader)).toBeGreaterThan(0);
  });

  it('should include rate limit headers on 429 response', async () => {
    mockRegisterRateLimiter.mockReturnValue({
      success: false,
      remaining: 0,
      resetTime: Date.now() + 3600 * 1000,
    });

    const request = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Internal server error
  // -------------------------------------------------------------------------
  it('should return 500 on unexpected errors', async () => {
    mockFindUnique.mockRejectedValue(new Error('Database connection failed'));

    const request = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should include rate limit headers on 500 response', async () => {
    mockFindUnique.mockRejectedValue(new Error('Database connection failed'));

    const request = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123',
    });

    const response = await POST(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
  });
});
