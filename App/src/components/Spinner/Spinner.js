import React from 'react';
import { css } from '@emotion/core';
import { PacmanLoader } from 'react-spinners';
// import { ClimbingBoxLoader } from 'react-spinners';
const override = css`
  display: block;
  margin: 0 auto;
`;

function Spinner({ loading = true }) {
  return (
    <div style={{ margin: 30 }}>
      <PacmanLoader
        css={override}
        sizeUnit={'px'}
        size={25}
        color={'yellow'}
        loading={loading}
      />
    </div>
  );
}

export default Spinner;
