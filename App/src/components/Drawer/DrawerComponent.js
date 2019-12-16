import React, { Fragment } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Typography,
  Button,
  Grid
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExitToApp from "@material-ui/icons/ExitToApp";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import Add from "@material-ui/icons/Add";
import DrawerContentComponent from "components/Drawer/DrawerContentComponent";
import { getUserLetter } from "utils/functions";

import "./Drawer.scss";

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    backgroundColor: "#262F3D",
    color: "#fff"
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    },
    backgroundColor: "#262F3D"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  exitButton: {
    position: "absolute",
    bottom: 0,
    borderTop: "1px solid grey"
  },
  addAccountButton: {
    position: "absolute",
    bottom: 50,
    borderTop: "1px solid grey"
  },
  icons: {
    color: "#fff"
  },
  iconSelected: {
    color: "blue"
  },
  divider: {
    backgroundColor: "grey"
  },
  thumbVerticalStyle: {
    backgroundColor: "#babcbf",
    "&:hover": {
      backgroundColor: "#D0D0D0"
    }
  },
  spaceRight: {
    marginRight: 15
  },
  textChatRoomsButton: {
    fontFamily: "'Google Sans', sans-serif"
  }
}));

const CustomListItemText = withStyles({
  primary: {
    fontFamily: "'Google Sans', sans-serif"
  }
})(ListItemText);

const getUserAvatar = userObj => {
  const avatar = { width: 30, height: 30 };
  return <Avatar style={avatar}>{getUserLetter(userObj)}</Avatar>;
};

export default function DrawerComponent(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [selectedItem, setSelectedItem] = React.useState(1);

  function handleListItemClick(event, newValue) {
    setSelectedItem(newValue);
  }

  const renderThumbVertical = () => (
    <div className={classes.thumbVerticalStyle} />
  );

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.open,
        [classes.drawerClose]: !props.open
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open
        })
      }}
      open={props.open}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={props.handleDrawerClose} className={classes.icons}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider className={classes.divider} />
      <ListItem button key={"profile"} selected={selectedItem === "profile"}>
        <Tooltip
          title={!props.open ? `${props.user.nickname}` : ""}
          placement="right"
        >
          <ListItemIcon className={classes.icons}>
            {getUserAvatar(props.user)}
          </ListItemIcon>
        </Tooltip>
        {props.open && (
          <CustomListItemText
            primary={
              <Typography noWrap>
                {props.user.nickname || "My Profile"}
              </Typography>
            }
          />
        )}
      </ListItem>
      {props.open && (
        <Fragment>
          <Divider className={classes.divider} />
          <ListItem key={"chatrooms"}>
            <ListItemIcon className={classes.icons}>
              <AllInboxIcon />
            </ListItemIcon>
            <CustomListItemText primary={"Chat Rooms"} />
          </ListItem>
        </Fragment>
      )}
      {!props.open && <Divider className={classes.divider} />}
      <Scrollbars
        className="scroll-box"
        autoHide
        renderThumbVertical={renderThumbVertical}
      >
        <DrawerContentComponent
          {...props}
          open={props.open}
          selectedItem={selectedItem}
          handleListItemClick={handleListItemClick}
        />
      </Scrollbars>
      <ListItem
        button
        key={"create-chat-room"}
        className="create-chat-room-container"
        onClick={e => {
          handleListItemClick(e, "create-chat-room");
          return props.goTo("create-chat-room");
        }}
        selected={selectedItem === "create-chat-room"}
      >
        <Tooltip
          title={!props.open ? "Create Chat Room" : ""}
          placement="right"
        >
          <ListItemIcon className={classes.icons}>
            <Add
              className={
                selectedItem === "create-chat-room" ? classes.iconSelected : ""
              }
            />
          </ListItemIcon>
        </Tooltip>
        <CustomListItemText
          primary={"Create Chat Rooms"}
          secondary={
            <Typography
              noWrap
              style={{
                fontSize: 10,
                fontFamily: "'Google Sans', sans-serif"
              }}
            >
              {"Add a new chat room"}
            </Typography>
          }
        />
      </ListItem>
      <ListItem
        button
        key={"logout"}
        className="exit-button-container"
        onClick={() => props.onSignout()}
      >
        <Tooltip title={!props.open ? "Log Out" : ""} placement="right">
          <ListItemIcon className={classes.icons}>
            <ExitToApp />
          </ListItemIcon>
        </Tooltip>
        <CustomListItemText primary={"Log Out"} />
      </ListItem>
    </Drawer>
  );
}
