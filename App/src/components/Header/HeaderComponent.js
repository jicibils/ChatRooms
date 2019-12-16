import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarRegister: {
    display: "flex !important",
    justifyContent: "space-between !important"
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  spaceRight: {
    marginRight: 10
  },
  chatRoomsButton: {
    color: "#fff",
    textTransform: "none"
  },
  textChatRoomsButton: {
    fontSize: 18,
    fontFamily: "'Google Sans', sans-serif"
  },
  backButton: {
    color: "#fff",
    border: "2px solid #fff",
    textTransform: "none"
  },
  accountsContainer: {
    display: "flex"
  },
  accountText: {
    fontSize: 17,
    marginRight: 15,
    fontFamily: "'Google Sans', sans-serif"
  },
  buttonProgressContainer: {
    marginTop: 15,
    paddingLeft: 5
  },
  helpText: {
    top: 0,
    color: "#d4d4d4",
    position: "absolute",
    fontSize: 13,
    paddingLeft: 50
  }
}));

export default function HeaderComponent(props) {
  const classes = useStyles();
  const { showOpenDrawerButton = true, showBackButton = false } = props;
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.open
      })}
    >
      <Toolbar className={props.showBackButton ? classes.appBarRegister : ""}>
        {showOpenDrawerButton && (
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={props.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: props.open
            })}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Button
          className={classes.chatRoomsButton}
          onClick={() => (showBackButton ? {} : props.goToDashboard())}
        >
          <Typography className={classes.textChatRoomsButton}>
            Chat Rooms
          </Typography>
        </Button>
        {showBackButton && (
          <Button
            className={classes.backButton}
            onClick={() => props.goToDashboard()}
          >
            <Typography className={classes.textChatRoomsButton}>
              Go Back
            </Typography>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
