import React from 'react';

import './LoadingIndicator.css';

const LoadingIndicator = () => (
  <div className="loading-wrapper">
    <div className="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default LoadingIndicator;
