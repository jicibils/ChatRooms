// // Main layout that contains page content with drawer
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import ContentWrapper from 'components/Wrapper/ContentWrapper';
import HeaderContainer from 'containers/Header/HeaderContainer';
import DrawerContainer from 'containers/Drawer/DrawerContainer';

import './Wrapper.scss';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    minHeight: '100vh'
  }
}));

export default function Wrapper() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HeaderContainer open={open} handleDrawerOpen={handleDrawerOpen} />
      <DrawerContainer open={open} handleDrawerClose={handleDrawerClose} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <ContentWrapper />
      </main>
    </div>
  );
}
