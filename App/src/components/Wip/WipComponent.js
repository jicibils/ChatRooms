import React from 'react';
import { withRouter } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import wip from 'assets/img/wip.png';
import './Wip.scss';

function Wip(props) {
  return (
    <div className="Wip">
      <header className="Wip-header">
        <img src={wip} className="Wip-logo" alt="logo" />
      </header>
      <IconButton
        aria-label="Sync"
        onClick={() => props.history.goBack()}
        style={{ border: '2px solid black', marginTop: 20 }}
      >
        <ArrowBack style={{ color: 'black', fontSize: 60 }} />
      </IconButton>
    </div>
  );
}

export default withRouter(Wip);
