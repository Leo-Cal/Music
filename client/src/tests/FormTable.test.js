import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormTable from '../components/FormTable';

beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            Forms: ['Symphony', 'Concerto', 'Sonata'],
          }),
      })
    );
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });

describe('Musical Forms table (FormTable component)', () => {
    it('renders loading state', () => {
            render(
                <MemoryRouter>
                    <FormTable/>
                </MemoryRouter>
            );
        expect(screen.getByText('Loading forms list...')).toBeInTheDocument();
    })

    it('renders the table when data is available', async () => {
        render(
          <MemoryRouter>
            <FormTable />
          </MemoryRouter>
        );
        await waitFor(() => {
          expect(screen.queryByText('Loading forms list...')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Musical Form')).toBeInTheDocument();
        expect(screen.getByText('Symphony')).toBeInTheDocument();
        expect(screen.getByText('Concerto')).toBeInTheDocument();
        expect(screen.getByText('Sonata')).toBeInTheDocument();
      });

    it('renders links with correct hrefs', async () => {
        render(
            <MemoryRouter>
            <FormTable />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading forms list...')).not.toBeInTheDocument();
            });
        ['Symphony', 'Concerto', 'Sonata'].forEach((form) => {
            const link = screen.getByRole('link', {name: form});
            expect(link).toHaveAttribute('href', `http://localhost:3000/form/${form}`);
        });
    });
})
