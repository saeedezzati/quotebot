import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders quote bot text', () => {
  const { getByText } = render(<App />);
  const Element = getByText(/Quote Bot./i);
  expect(Element).toBeInTheDocument();
});
