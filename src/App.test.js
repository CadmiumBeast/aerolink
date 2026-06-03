import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the airline landing page', () => {
  render(<App />);
  expect(screen.getByText(/elegant flight booking experiences/i)).toBeInTheDocument();
  expect(screen.getByText(/signup and login/i)).toBeInTheDocument();
});
