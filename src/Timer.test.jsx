import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from './Timer';

describe('Timer Component', () => {

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders initial state correctly', () => {
    render(<Timer />);
    
    expect(screen.queryByTestId('hours')).not.toBeInTheDocument(); 
    expect(screen.getByTestId('minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('seconds')).toHaveTextContent('05');
    expect(screen.getByTestId('milliseconds')).toHaveTextContent('00');
    
    expect(screen.getByTestId('hours-input')).toHaveValue(0);
    expect(screen.getByTestId('minutes-input')).toHaveValue(0);
    expect(screen.getByTestId('seconds-input')).toHaveValue(5);

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
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

    expect(screen.queryByTestId('hours')).not.toBeInTheDocument(); 
    expect(screen.getByTestId('minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('seconds')).toHaveTextContent('05');
    expect(screen.getByTestId('milliseconds')).toHaveTextContent('00');
  });

  test('hides inputs and reset button when running', () => {
    render(<Timer />);
    
    expect(screen.getByTestId('hours-input')).toHaveValue(0);
    expect(screen.getByTestId('minutes-input')).toHaveValue(0);
    expect(screen.getByTestId('seconds-input')).toHaveValue(5);

    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    expect(screen.queryByTestId('hours-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('minutes-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('seconds-input')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });

  test('theme toggle switches themes', () => {
    render(<Timer />);
    const timerContainer = screen.getByTestId('timer-display').closest('.timer-container');
    const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(timerContainer).toHaveClass('theme-dark');
    expect(timerContainer).not.toHaveClass('theme-light');

    fireEvent.click(themeToggleButton);

    expect(timerContainer).toHaveClass('theme-light');
    expect(timerContainer).not.toHaveClass('theme-dark');

    fireEvent.click(themeToggleButton);

    expect(timerContainer).toHaveClass('theme-dark');
    expect(timerContainer).not.toHaveClass('theme-light');
  });

  test('hours input works and displays correctly', () => {
    render(<Timer />);
    const hoursInput = screen.getByTestId('hours-input');
    const minutesInput = screen.getByTestId('minutes-input');
    const secondsInput = screen.getByTestId('seconds-input');
    const startButton = screen.getByRole('button', { name: /start/i });

    fireEvent.change(hoursInput, { target: { value: '1' } });
    expect(hoursInput).toHaveValue(1);
    
    fireEvent.change(minutesInput, { target: { value: '10' } });
    expect(minutesInput).toHaveValue(10);

    fireEvent.change(secondsInput, { target: { value: '30' } });
    expect(secondsInput).toHaveValue(30);

    fireEvent.click(startButton);

    expect(screen.getByTestId('hours')).toHaveTextContent('01');
    expect(screen.getByTestId('minutes')).toHaveTextContent('10');
    expect(screen.getByTestId('seconds')).toHaveTextContent('30');
  });
});