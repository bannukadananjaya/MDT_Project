import React, { useCallback, useState, useEffect } from 'react';
import { useMap } from 'react-map-gl';

export default function Controls() {
  const { mymap } = useMap();
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!mymap) {
      return;
    }

    const onMove = () => {
      const { lng, lat } = mymap.getCenter();
      setInputValue(`${lng.toFixed(3)}, ${lat.toFixed(3)}`);
      setHasError(false); // Reset error when map moves
    };
    mymap.on('move', onMove);
    onMove();

    return () => {
      mymap.off('move', onMove);
    };
  }, [mymap]);

  const onChange = useCallback((evt) => {
    setInputValue(evt.target.value);
    setHasError(false); // Reset error when input changes
  }, []);

  const onSubmit = useCallback(() => {
    const [lng, lat] = inputValue.split(',').map(Number);
    if (isNaN(lng) || isNaN(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 85) {
      setHasError(true);
    } else {
      mymap.easeTo({
        center: [lng, lat],
        duration: 1000,
      });
    }
  }, [mymap, inputValue]);

  return (
    <div style={{ padding: 12, fontFamily: 'sans-serif' }}>
      <span>MAP CENTER: </span>
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        style={{ color: hasError ? 'red' : 'black' }}
      />
      <button onClick={onSubmit}>GO</button>
      {hasError && <div style={{ color: 'red' }}>Invalid coordinates</div>}
    </div>
  );
}
