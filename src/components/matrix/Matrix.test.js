import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Matrix from './Matrix';

import { COLORS, initMatrix, mockMatrix, mockResultMatrix } from '../../utils/index';

test('renders all grid tiles', () => {
  const { getByTestId  } = render(<Matrix matrix={initMatrix()} colors={COLORS} />);
  const tilesWrapper = getByTestId('tile-grid');
  expect(tilesWrapper.children.length).toBe(100);
});

test('renders results text when last possible match is clicked', () => {  
  const { getAllByRole, getByText } = render(<Matrix matrix={mockResultMatrix} colors={COLORS} />);

  // get last tile in the grid
  const tile = getAllByRole('button')[99];

  fireEvent.click(tile);

  const overlayMessageElement = getByText(/no possible match left, game has ended./i);
  expect(overlayMessageElement).not.toBeNull();
});

test('correct tiles are collapsed when a tile is clicked', () => {  
  const { getAllByRole, getByText } = render(<Matrix matrix={mockMatrix} colors={COLORS} />);
  
  // mockMatrix has two adjacent same color tiles, 5th and 6th elements.
  // get the fifth tile
  const tile = getAllByRole('button')[4];

  fireEvent.click(tile);

  const collapsedTiles = getAllByRole('button');
  expect(collapsedTiles[0]).toHaveClass('tile--gray');
  expect(collapsedTiles[1]).toHaveClass('tile--gray');
});
