import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const action = (key, closeSnackbar) => (
  <IconButton
    key="close"
    aria-label="Close"
    color="inherit"
    onClick={() => closeSnackbar(key)}
  >
    <CloseIcon style={{ fontSize: 20 }} />
  </IconButton>
);

const SnackByType = (variant, message, enqueueSnackbar, closeSnackbar) => {
  return enqueueSnackbar(message, {
    variant,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    action: key => action(key, closeSnackbar)
  });
};

/**
 * Creates an info SnackBar notification
 */
const successSnackBar = (message, enqueueSnackbar, closeSnackbar) => {
  return SnackByType('success', message, enqueueSnackbar, closeSnackbar);
};

/**
 * Creates an info SnackBar notification
 */
const errorSnackBar = (message, enqueueSnackbar, closeSnackbar) => {
  return SnackByType('error', message, enqueueSnackbar, closeSnackbar);
};

/**
 * Creates an info SnackBar notification
 */
const warnSnackBar = (message, enqueueSnackbar, closeSnackbar) => {
  return SnackByType('warning', message, enqueueSnackbar, closeSnackbar);
};

/**
 * Creates an info SnackBar notification
 */
const infoSnackBar = (message, enqueueSnackbar, closeSnackbar) => {
  return SnackByType('info', message, enqueueSnackbar, closeSnackbar);
};

export { successSnackBar, errorSnackBar, warnSnackBar, infoSnackBar };
