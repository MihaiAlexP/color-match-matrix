import React from 'react';

import Tile from '../tile/Tile';

class Matrix extends React.Component {
  state = {
    matrix: this.props.matrix || [],
    found: [],
    isInProgress: true,
  }

  componentDidMount() {
    this.tempFound = [];
    this.matchFound = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { matrix, found } = this.state;
    const newMatrix = [...matrix];

    found.forEach(item => newMatrix[item.x][item.y].color = item.color);

    if (found.length && prevState.found.length !== found.length ) {
      this.setState({ matrix: newMatrix }, () => this.colapseMatrix());
    }
  }

  isGameInProgress() {
    const { size = 10 } = this.props;
    const { matrix, isInProgress } = this.state;

    // reset matchFound on every update
    this.matchFound = false;

    for (let i = size - 1; i >= 0; i--) {
      for (let j = size - 1; j >= 0; j--) {
        const tile = matrix[i][j];
        if (tile.color !== 4 && !this.matchFound) {
          if (i > 0) {
            if (matrix[i-1][j].color === tile.color) {
              this.matchFound = true;
              // if matchFound game is still i  progress, break
              break;
            }
          }
      
          if (j > 0) {
            if (matrix[i][j-1].color === tile.color) {
              this.matchFound = true;
              break;
            }
          }
      
          if (i < (size - 1)) {
            if (matrix[i+1][j].color === tile.color) {
              this.matchFound = true;
              break;
            }
          }
      
          if (j < (size - 1)) {
            if (matrix[i][j+1].color === tile.color) {
              this.matchFound = true;
              break;
            }
          }
        }
      }
    }

    if (!this.matchFound) {
      if (isInProgress) {
        this.setState({ isInProgress: false });
      }
    }
  }

  colapseMatrix() {
    const { size = 10 } = this.props;
    const { matrix } = this.state;
    // copy the matrix without keeping a reference to the original
    const newMatrix = matrix.map(item => [...item].map(obj => ({...obj})));
    
    let matchedTiles = 0;
    for (let i = 0; i < size; i++) {
      matchedTiles = 0;
      for (let j = size - 1; j >= 0; j--) {        
        if (newMatrix[i][j].color === 4) {
          matchedTiles++;
        } else if (matchedTiles > 0) {
          const currentSpot = newMatrix[i][j];
          const newSpot = newMatrix[i][j + matchedTiles];

          newMatrix[i][j] = newSpot;
          // update coordinates to reflect new position
          newMatrix[i][j].x = i;
          newMatrix[i][j].y = j;

          newMatrix[i][j + matchedTiles] = currentSpot;
          // update coordinates to reflect new position
          newMatrix[i][j + matchedTiles].x = i;
          newMatrix[i][j + matchedTiles].y = j + matchedTiles;
        }
      }
    }
    
    this.setState({ found: [], matrix: newMatrix }, () => this.isGameInProgress());
  }

  getSameColorAdjacentTiles(x, y, color) {
    const { size = 10, colors = [] } = this.props;
    const { matrix, found } = this.state;
    
    if (this.tempFound.find(n => n.id === matrix[x][y].id) ||
      matrix[x][y].color !== colors.indexOf(color)
    ) { return; }

    const item = {
      id: matrix[x][y].id,
      x,
      y,
      color: 4,
    }

    this.tempFound.push(item);

    if (this.tempFound.length > 1) {
      this.setState({ found: [...found, ...this.tempFound] });
    }

    if (x > 0) {
      this.getSameColorAdjacentTiles(x - 1, y, color);
    }

    if (y > 0) {
      this.getSameColorAdjacentTiles(x, y - 1, color);
    }

    if (x < (size - 1)) {
      this.getSameColorAdjacentTiles(x + 1, y, color);
    }

    if (y < (size - 1)) {
      this.getSameColorAdjacentTiles(x, y + 1, color);
    }
  }

  handleTileClick(x, y, color) {
    const { colors = [] } = this.props;

    // don't do anything if tile was previously clicked 
    if (colors.indexOf(color) === 4) return;

    // reset found state on every click
    this.tempFound = [];
    this.setState({ found: [] }, () =>
      this.getSameColorAdjacentTiles(x, y, color)
    );
  }

  renderTiles() {
    const { colors = [] } = this.props;
    const { matrix } = this.state;
    const tiles = [];
    
    if (matrix.length === 0) return;

    matrix.forEach((row) => {
      row.forEach((tile) => {
        const color = colors[tile.color];

        tiles.push(
          <Tile
            key={tile.id}
            onClick={() => this.handleTileClick(tile.x, tile.y, color)}
            color={color}
          />
        );
      });
    });

    return tiles;
  }

  render() {
    const { isInProgress } = this.state;

    return (
      <div className="tile-grid" data-testid="tile-grid">
        {this.renderTiles()}
        {!isInProgress &&
          <div className="result-overlay">
            <h2 data-testid="result-message">No possible match left, game has ended.</h2>
          </div>
        }
      </div>
    );
  }
}

export default Matrix;
