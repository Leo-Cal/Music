import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComposerTable from '../components/ComposerTable';

beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            Composers: [
                {name:'Beethoven', birthyear:1000}, 
                {name:'Copland', birthyear:2000}, 
                {name:'Haydn', birthyear:3000}
            ],
          }),
      })
    );
  });
  
afterEach(() => {
    jest.resetAllMocks();
});

describe('Composer table (ComposerTable)', () => {
    it('renders loading state', () => {
            render(
                <MemoryRouter>
                    <ComposerTable/>
                </MemoryRouter>
            );
        expect(screen.getByText('Loading composer list...')).toBeInTheDocument();
    })

    it('renders the table when data is available', async () => {
        render(
          <MemoryRouter>
            <ComposerTable />
          </MemoryRouter>
        );
        await waitFor(() => {
          expect(screen.queryByText('Loading composer list...')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Beethoven')).toBeInTheDocument();
        expect(screen.getByText('Haydn')).toBeInTheDocument();
        expect(screen.getByText('Copland')).toBeInTheDocument();
      });

    it('renders links with correct hrefs', async () => {
        render(
            <MemoryRouter>
            <ComposerTable />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading composer list...')).not.toBeInTheDocument();
            });
        ['Beethoven', 'Copland', 'Haydn'].forEach((composer) => {
            const link = screen.getByRole('link', {name: composer});
            expect(link).toHaveAttribute('href', `http://localhost:3000/composer/${composer}`);
        });
    });
})
