import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sign in header', () => {
  render(<App />);
  const titleElement = screen.getByText(/Sign in to Calendar/i);
  expect(titleElement).toBeInTheDocument();
});
