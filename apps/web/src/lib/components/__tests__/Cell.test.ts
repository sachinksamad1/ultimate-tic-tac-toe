import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Cell from '../Cell.svelte';

describe('Cell.svelte', () => {
  it('renders an empty cell', () => {
    const { getByRole } = render(Cell, {
      props: {
        value: null,
        x: 0,
        y: 0,
        onClick: () => {},
      },
    });

    const button = getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Empty cell at 0,0');
    expect(button.classList.contains('empty')).toBe(true);
  });

  it('renders a cell with X', () => {
    const { getByRole } = render(Cell, {
      props: {
        value: 'X',
        x: 1,
        y: 1,
        onClick: () => {},
      },
    });

    const button = getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Cell 1,1 marked X');
    expect(button.classList.contains('x')).toBe(true);
  });

  it('renders a cell with O', () => {
    const { getByRole } = render(Cell, {
      props: {
        value: 'O',
        x: 2,
        y: 2,
        onClick: () => {},
      },
    });

    const button = getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Cell 2,2 marked O');
    expect(button.classList.contains('o')).toBe(true);
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(Cell, {
      props: {
        value: null,
        x: 0,
        y: 0,
        onClick,
      },
    });

    const button = getByRole('button');
    await fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when value is present', () => {
    const { getByRole } = render(Cell, {
      props: {
        value: 'X',
        x: 0,
        y: 0,
        onClick: () => {},
      },
    });

    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(Cell, {
      props: {
        value: null,
        disabled: true,
        x: 0,
        y: 0,
        onClick: () => {},
      },
    });

    const button = getByRole('button');
    expect(button).toBeDisabled();
  });
});
