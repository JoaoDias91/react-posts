import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import Home from '.';
import userEvent from '@testing-library/user-event';
import exp from 'constants';

const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', async (rec, res, ctx) => {
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'title1',
          body: 'body1',
        },
        {
          userId: 2,
          id: 2,
          title: 'title2',
          body: 'body2',
        },
        {
          userId: 3,
          id: 3,
          title: 'title3',
          body: 'body3',
        },
      ]),
    );
  }),
  rest.get('https://jsonplaceholder.typicode.com/photos', async (rec, res, ctx) => {
    return res(
      ctx.json([
        {
          url: 'img1.jpg',
        },
        {
          url: 'img2.jpg',
        },
        {
          url: 'img3.jpg',
        },
      ]),
    );
  }),
];

const server = setupServer(...handlers);

describe('<Home />', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.restoreHandlers();
  });

  it('should render search, posts and load more', async () => {
    render(<Home />);

    expect.assertions(3);

    const noMorePosts = screen.getByText('Não existem posts =(');
    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/search/i);
    expect(search).toBeInTheDocument();

    const images = screen.getAllByRole('img', { name: /title/i });
    expect(images).toHaveLength(2);

    const button = screen.getByRole('button', { name: /load more posts/i });
    expect(button).toBeInTheDocument();
  });
  it('should search for posts', async () => {
    render(<Home />);

    const noMorePosts = screen.getByText('Não existem posts =(');
    await waitForElementToBeRemoved(noMorePosts);
    const search = screen.getByPlaceholderText(/search/i);

    expect.assertions(10);

    expect(screen.getByRole('heading', { name: 'title1 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title2 2' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title3 3' })).not.toBeInTheDocument();

    userEvent.type(search, 'title1');
    expect(screen.getByRole('heading', { name: 'title1 1' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title2 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title3 3' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search value: title1' })).toBeInTheDocument();

    userEvent.clear(search);
    expect(screen.getByRole('heading', { name: 'title1 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title2 2' })).toBeInTheDocument();

    userEvent.type(search, 'blabla');
    expect(screen.getByText('Não existem posts =(')).toBeInTheDocument();
  });
  it('should load more posts when button is clicked', async () => {
    render(<Home />);

    const noMorePosts = screen.getByText('Não existem posts =(');
    await waitForElementToBeRemoved(noMorePosts);
    const button = screen.getByRole('button', { name: /load more posts/i });
    userEvent.click(button);
    expect(screen.getByRole('heading', { name: 'title3 3' })).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
