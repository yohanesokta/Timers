import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from './Timer';

// Mocks are now in jest.setup.js

describe('Timer Component', () => {

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders initial state correctly', () => {
    render(<Timer />);
    
    // Check initial time using data-testid
    expect(screen.getByTestId('minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('seconds')).toHaveTextContent('05');
    expect(screen.getByTestId('milliseconds')).toHaveTextContent('00');
    
    // Check initial buttons
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    // The reset button IS visible on initial render because a time is set
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('starts and stops the timer', () => {
    render(<Timer />);
    
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByRole('button', { name: /stop/i }));

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /stop/i })).not.toBeInTheDocument();
  });

  test('resets the timer', () => {
    render(<Timer />);
    
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    fireEvent.click(screen.getByRole('button', { name: /stop/i }));
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // After reset, time should be back to the initial set time of 00:05
    expect(screen.getByTestId('minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('seconds')).toHaveTextContent('05');
    expect(screen.getByTestId('milliseconds')).toHaveTextContent('00');
  });

  test('hides inputs and reset button when running', () => {
    render(<Timer />);
    
    // Inputs are visible initially
    expect(screen.getByDisplayValue('00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('05')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Inputs and Reset button should be hidden
    expect(screen.queryByDisplayValue('00')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('05')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });
});
