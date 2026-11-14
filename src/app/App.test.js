import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  render(<App />);
  const linkElement = screen.getByText(/property investment calculator/i);
  expect(linkElement).toBeInTheDocument();
});
