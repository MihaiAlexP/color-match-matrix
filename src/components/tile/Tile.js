import React from 'react';

const Tile = (props) => {
  const { color, onClick } = props;

  return (
    <div
      className={`tile tile--${color}`}
      onClick={onClick}
      role="button"
    >
    </div>
  );
}

export default Tile;