import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingIndicator from './LoadingIndicator';

describe('<LoadingIndicator />', () => {
  test('it should mount', () => {
    render(<LoadingIndicator />);
    
    const loadingIndicator = screen.getByTestId('LoadingIndicator');

    expect(loadingIndicator).toBeInTheDocument();
  });
});