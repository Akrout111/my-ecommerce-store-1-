import { describe, it, expect, vi } from 'vitest';

describe('Test Infrastructure', () => {
  it('should run vitest correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have jest-dom matchers available', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    expect(div).toHaveTextContent('Hello World');
  });

  it('should mock next/navigation', async () => {
    const { useRouter } = await import('next/navigation');
    const router = useRouter();
    expect(router.push).toBeDefined();
    expect(typeof router.push).toBe('function');
  });

  it('should mock next-auth/react', async () => {
    const { useSession } = await import('next-auth/react');
    const session = useSession();
    expect(session.status).toBe('unauthenticated');
  });

  it('should have IntersectionObserver mock', () => {
    const observer = new IntersectionObserver(vi.fn());
    expect(observer.observe).toBeDefined();
  });

  it('should have ResizeObserver mock', () => {
    const observer = new ResizeObserver();
    expect(observer.observe).toBeDefined();
  });

  it('should have matchMedia mock', () => {
    const mql = window.matchMedia('(min-width: 768px)');
    expect(mql.matches).toBe(false);
  });
});
