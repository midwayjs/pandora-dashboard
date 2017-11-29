import React from 'react';

export const SpanCostIndicator = (props) => {

  const {start, duration, total, style} = props;

  const startPercent = start / total;
  const durationPercent = duration / total;

  const ownStyle = Object.assign({}, {background: '#eee', position: 'relative', height: 12, borderRadius: 5, overflow: 'hidden'}, style);

  return <div style={ownStyle} >
    <div style={{
      position: 'absolute',
      top: 0, left: startPercent * 100 + '%',
      width: durationPercent * 100 + '%', height: '100%',
      background: '#108ee9',
      borderRadius: 5
    }} />
  </div>;

};
