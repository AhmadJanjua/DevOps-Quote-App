import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home, { LoadingDiv, ErrorDiv, QuoteDiv } from '@/app/page';

// -- LoadingDiv Test
it('renders a loading message', () => {
  render(<LoadingDiv />);

  // check if loading is present
  const message = screen.getByText(/loading…/i);
  expect(message).toBeInTheDocument();
});

// -- ErrorDiv Test
it('renders the error message', () => {
  const err_message = 'Something went wrong';
  render(<ErrorDiv error={err_message} />);

  // The paragraph with the error text should be present
  const message = screen.getByText(`Error: ${err_message}`);
  expect(message).toBeInTheDocument();
});

// -- QuoteDiv Tests
describe('QuoteDiv', () => {
  it('renders successful quote page', () => {
    const props = {
      count: 5,
      quote: 'Test quote',
      author: 'Test Author',
      name: 'Ahmad',
    }

    render(<QuoteDiv {...props} />);

    // Visitor count
    const visit_message = screen.getByText(`You are visitor number ${props.count}`);

    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent(`You are visitor number ${props.count}`);

    // Quote text
    expect(
      screen.getByText(`“${props.quote}”`)
    ).toBeInTheDocument();

    // Author text
    expect(
      screen.getByText(`- ${props.author}`)
    ).toBeInTheDocument();

    // Footer shows current year and name
    const year = new Date().getFullYear();

    expect(
      screen.getByText(`© ${year} ${props.name}`)
    ).toBeInTheDocument();
  });

  it('renders with falsy values', () => {
    const props = {
      count: 0,
      quote: '',
      author: '',
      name: '',
    }

    render(<QuoteDiv {...props} />);

    // count is never zero
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('You are visitor number 1');

    // quote missing message
    expect(
      screen.getByText('“Quote went missing >_<”')
    ).toBeInTheDocument();

    // author goes unknown rather than empty
    expect(
      screen.getByText('- Unknown')
    ).toBeInTheDocument();

    // footer is blank
    const year = new Date().getFullYear();

    expect(
      screen.getByText(`© ${year}`)
    ).toBeInTheDocument();
  });
});

describe('Home with mocked fetch', () => {
  // make fetch a mock function
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  // reset after each usage
  afterEach(() => {
    jest.clearAllMocks();
  });

  // free resources
  afterAll(() => {
    delete global.fetch;
  });

  it('renders a quote after successful api call', async () => {
    // mock a successful response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 42,
        quote: 'Mocked quote!',
        author: 'Test Author',
      }),
    });

    render(<Home />);

    // wait for quote page to appear
    await waitFor(() => {
      expect(screen.getByText('You are visitor number 42')).toBeInTheDocument();
      expect(screen.getByText('“Mocked quote!”')).toBeInTheDocument();
      expect(screen.getByText('- Test Author')).toBeInTheDocument();
    });
  });

  it('renders error on non-OK HTTP status', async () => {
    // mock error
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error 500: Internal Server Error/i)
      ).toBeInTheDocument();
    });
  });

  it('renders an error', async () => {
    // mock error thrown
    global.fetch.mockRejectedValue(new Error('network down'));

    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error: network down/i)
      ).toBeInTheDocument();
    });
  });
});
