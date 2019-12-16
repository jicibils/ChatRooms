import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from "@material-ui/core";
import ChevronRight from "@material-ui/icons/ChevronRight";
import CommentIcon from "@material-ui/icons/Comment";
import { formatDatetime } from "utils/dates";
import { getCreatorStr, getParticipantsStr } from "utils/functions";

import map from "lodash/map";
import startCase from "lodash/startCase";

import "./Drawer.scss";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  icons: {
    color: "#babcbf"
  },
  iconSelected: {
    color: "#0000ff",
    marginRight: 30,
    marginLeft: 15
  },
  chevronRightIcon: {
    color: "#babcbf",
    marginLeft: 20
  },
  divider: {
    backgroundColor: "#babcbf"
  },
  drawerMainIcons: {
    marginRight: 30,
    marginLeft: 15
  },
  listItemStyle: {
    height: 70,
    padding: 0
  }
}));

const CustomListItemText = withStyles({
  primary: {
    fontFamily: "'Google Sans', sans-serif"
  },
  secondary: {
    color: "#babcbf"
  }
})(ListItemText);

export default function DrawerContentComponent(props) {
  const classes = useStyles();
  const { handleListItemClick, selectedItem, rooms, user } = props;

  return (
    <div className={classes.root}>
      {map(rooms, (room, index) => {
        const isSelected = selectedItem === room.name;
        return (
          <Fragment key={index}>
            <ListItem
              button
              key={room.name}
              selected={isSelected}
              className={classes.listItemStyle}
              onClick={e => {
                handleListItemClick(e, room.name);
                return props.goTo(`chat-room/${room.id}`);
              }}
            >
              {props.open ? (
                <Fragment>
                  <CommentIcon className={classes.drawerMainIcons} />
                  <CustomListItemText
                    primary={startCase(room.name)}
                    secondary={
                      <Fragment>
                        <Typography
                          noWrap
                          style={{
                            fontSize: 10,
                            fontFamily: "'Google Sans', sans-serif"
                          }}
                        >
                          {getCreatorStr(user.id, room)}
                        </Typography>
                        <Typography
                          noWrap
                          style={{
                            fontSize: 10,
                            fontFamily: "'Google Sans', sans-serif"
                          }}
                        >
                          {`${formatDatetime(
                            new Date(room.created),
                            "pretty",
                            true
                          )}`}
                        </Typography>
                        <Typography
                          noWrap
                          style={{
                            fontSize: 10,
                            fontFamily: "'Google Sans', sans-serif"
                          }}
                        >
                          {getParticipantsStr(room)}
                        </Typography>
                      </Fragment>
                    }
                  />

                  <ListItemIcon className={classes.icons}>
                    <ChevronRight className={classes.chevronRightIcon} />
                  </ListItemIcon>
                </Fragment>
              ) : (
                <Tooltip
                  title={!props.open ? startCase(room.name) : ""}
                  placement="right"
                >
                  <ListItemIcon className={classes.icons}>
                    <CommentIcon
                      className={
                        isSelected
                          ? classes.iconSelected
                          : classes.drawerMainIcons
                      }
                    />
                  </ListItemIcon>
                </Tooltip>
              )}
            </ListItem>
            <Divider className={classes.divider} />
          </Fragment>
        );
      })}
    </div>
  );
}
