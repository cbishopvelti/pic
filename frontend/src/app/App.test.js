import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app title and the property list', async () => {
  render(<App />);
  expect(screen.getByText(/property investment calculator/i)).toBeInTheDocument();
  // The list loads asynchronously; waiting for it also keeps React's act() warning out of the output.
  expect(await screen.findByText(/pinnocks way/i)).toBeInTheDocument();
});
