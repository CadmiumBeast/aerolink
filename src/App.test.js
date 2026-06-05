import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(async (url) => {
    const body = url.includes('/ports')
      ? [
          { id: 1, name: 'Dubai International Airport', code: 'DXB' },
          { id: 2, name: 'Nairobi Jomo Kenyatta International Airport', code: 'NBO' },
        ]
      : [];

    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify(body),
    };
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the airline landing page', async () => {
  render(<App />);
  expect(screen.getByText(/elegant flight booking experiences/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/find fares with live ports/i)).toBeInTheDocument();
    expect(screen.getByText(/manage origin and destination ports/i)).toBeInTheDocument();
  });
});
