// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Footer } from '@/components/Footer';
import { Accordion } from '@/components/ui/Accordion';
import About from '@/pages/About';
import Article from '@/pages/Article';
import BecomeSeller from '@/pages/BecomeSeller';
import Faq from '@/pages/Faq';
import Privacy from '@/pages/Privacy';
import Promotions from '@/pages/Promotions';
import SellerRules from '@/pages/SellerRules';
import Support from '@/pages/Support';

// The article page loads related products; the tests do not need them.
vi.mock('@/hooks/useSearchProducts', () => ({
  useSearchProducts: () => ({ products: [], isLoading: false }),
}));

afterEach(cleanup);

const renderAt = (
  path: string,
  routes: { path: string; element: ReactNode }[],
) =>
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [path] })}
    />,
  );

describe('static pages', () => {
  it.each([
    ['/about', <About />, 'About us'],
    ['/faq', <Faq />, 'FAQ'],
    ['/become-a-seller', <BecomeSeller />, 'How to Become a Seller'],
    ['/seller-rules', <SellerRules />, 'Rules for Sellers'],
    ['/promotions', <Promotions />, 'Discounts and Promotions'],
    ['/support', <Support />, 'Support Center'],
    ['/privacy', <Privacy />, 'Privacy Policy'],
  ])('%s renders one h1 and sets the title', (path, element, heading) => {
    renderAt(path, [{ path, element }]);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe(heading);
    expect(document.title).toBe(`${heading} | B2Bar`);
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
    ).toBeTruthy();
  });
});

describe('article pages', () => {
  const articleRoutes = [
    { path: '/discover/:slug', element: <Article /> },
    { path: '/accessories', element: <Article /> },
  ];

  it.each([
    ['/discover/irish-cream', 'Affordable Irish Cream Innovations'],
    ['/discover/nemiroff', 'Nemiroff De Luxe'],
    ['/discover/fre-pinot', 'FRE Pinot Grigio'],
    [
      '/accessories',
      'Style in the Details: Alcohol Accessories That Set the Mood',
    ],
  ])('%s renders the article', (path, heading) => {
    renderAt(path, articleRoutes);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(heading);
    expect(screen.getByRole('link', { name: /Back to Discover/ })).toBeTruthy();
  });

  it('shows NotFound for an unknown slug', () => {
    renderAt('/discover/unknown-article', articleRoutes);

    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.getByText(/couldn’t find this page/)).toBeTruthy();
  });
});

describe('Accordion', () => {
  const items = [
    { id: 'one', title: 'First question', content: <p>First answer</p> },
    { id: 'two', title: 'Second question', content: <p>Second answer</p> },
  ];

  it('toggles a panel and links it to its button', () => {
    render(<Accordion items={items} />);
    const button = screen.getByRole('button', { name: 'First question' });
    const panel = document.getElementById(
      button.getAttribute('aria-controls') ?? '',
    );

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(panel?.hidden).toBe(true);

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(panel?.hidden).toBe(false);
    expect(screen.getByRole('region', { name: 'First question' })).toBeTruthy();

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('moves focus between headers with the arrow keys', () => {
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: 'First question' });
    const second = screen.getByRole('button', { name: 'Second question' });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(second);

    fireEvent.keyDown(second, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: 'End' });
    expect(document.activeElement).toBe(second);
  });
});

describe('Footer', () => {
  it('has no Careers link and no phone number', () => {
    renderAt('/', [{ path: '/', element: <Footer /> }]);

    expect(screen.queryByText('Careers')).toBeNull();
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'support@b2bar.tech' })
        .getAttribute('href'),
    ).toBe('mailto:support@b2bar.tech');
  });

  it('links to the static pages', () => {
    renderAt('/', [{ path: '/', element: <Footer /> }]);

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/about',
        '/faq',
        '/become-a-seller',
        '/seller-rules',
        '/promotions',
        '/support',
        '/privacy',
      ]),
    );
  });
});
