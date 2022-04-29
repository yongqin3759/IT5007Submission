import React from 'react';

const Error = ({ msg }) => {
  if (!msg) {
    return null;
  }
  return (
    <div>
      <h3 style={{ color: 'red' }}>{msg}</h3>
      <p style={{ color: 'red' }}><b>*Edit assigned percentage to save</b></p>
    </div>
  );
};

export default Error;
