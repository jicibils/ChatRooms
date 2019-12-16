import React, { Fragment } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import { formatDatetime } from "utils/dates";
import {
  getCreatorStr,
  getIsAuthor,
  getParticipantsStr
} from "utils/functions";

import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import capitalize from "lodash/capitalize";

import "./ChatRoom.scss";

const ColorCircularProgress = withStyles({
  root: {
    color: "rgba(255, 255, 255, 0.7)"
  }
})(CircularProgress);

const CustomTextField = withStyles({
  root: {
    marginTop: 20
  }
})(TextField);

const theme = createMuiTheme({
  palette: {}
});

const RenderAccessRoom = props => {
  const {
    selectedRoom,
    user,
    isOwnerOrParticipant,
    toggleShowRoom,
    isJoining,
    onAddParticipant
  } = props;
  return (
    <Container className={"create-chat-room-container"}>
      <Grid item xs={12} container justify="center">
        <Grid
          item
          xs={12}
          md={4}
          container
          justify="center"
          className={"create-chat-room-main-column"}
        >
          <Paper className={"all-width create-chat-room-box"}>
            <p className={"create-chat-room-title"}>
              {capitalize(selectedRoom.name)}
            </p>
            <p>{getCreatorStr(user.id, selectedRoom)}</p>
            <p>
              {formatDatetime(new Date(selectedRoom.created), "pretty", true)}
            </p>
            <p>{getParticipantsStr(selectedRoom)}</p>
            {isOwnerOrParticipant ? (
              <Button
                variant="outlined"
                onClick={() => toggleShowRoom()}
                classes={{ root: "create-chat-room-button" }}
              >
                Enter to the Room
              </Button>
            ) : (
              <Fragment>
                <Button
                  variant="outlined"
                  disabled={isJoining}
                  onClick={() => onAddParticipant()}
                  classes={{ root: "create-chat-room-button" }}
                >
                  Join Room
                </Button>
                {isJoining && (
                  <div className={"button-progress-container"}>
                    <ColorCircularProgress size={24} />
                  </div>
                )}
              </Fragment>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const RenderRoom = props => {
  const {
    selectedRoom,
    user,
    isOwnerOrParticipant,
    toggleShowRoom,
    isJoining,
    onAddParticipant,
    isSending
  } = props;
  return (
    <Grid item xs={12} container justify="center">
      <Card className={"chat-container-box"}>
        <CardHeader
          title={selectedRoom.name}
          subheader={`${getCreatorStr(
            user,
            selectedRoom
          )} - ${getParticipantsStr(selectedRoom)}`}
        />
        <hr></hr>
        <CardContent className={"messages-container scroll-box"}>
          <RenderMessagesZone {...props}></RenderMessagesZone>
        </CardContent>
        <hr></hr>
        <CardActions disableSpacing>
          <RenderWriteZone {...props}></RenderWriteZone>
        </CardActions>
      </Card>
    </Grid>
  );
};

const RenderMessagesZone = props => {
  const { messages } = props;
  if (isEmpty(messages))
    return (
      <Typography variant="body2" color="textSecondary" component="p">
        There are no messages in this room
      </Typography>
    );

  return map(messages, message => (
    <RenderMessage {...props} message={message}></RenderMessage>
  ));
};

const RenderMessage = props => {
  const { message, user } = props;
  const isAuthor = getIsAuthor(user.id, message);
  return (
    <Fragment>
      <br></br>
      <Grid
        item
        xs={12}
        container
        justify={isAuthor ? "flex-end" : "flex-start"}
      >
        <Grid item xs={8}>
          <Paper className={isAuthor ? "message-box-author" : "message-box"}>
            <Grid
              item
              xs={12}
              container
              justify="flex-start"
              alignItems="center"
            >
              <Typography
                variant="h6"
                component="h3"
                className={"message-author"}
              >
                {isAuthor ? "You" : message.sender_name}
              </Typography>
              <Typography className={"message-date"}>
                {formatDatetime(new Date(message.created), "pretty", true)}
              </Typography>
            </Grid>
            <Grid item xs={12} container justify="flex-start">
              <Typography component="p" className={"message-content"}>
                {message.message}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const RenderWriteZone = props => {
  const {
    isSending,
    fieldSpec,
    showErrors,
    validationErrors,
    message,
    onHandleChange,
    submitForm
  } = props;
  return (
    <Grid
      item
      xs={12}
      container
      justify="center"
      alignItems="center"
      className={"write-zone-container"}
    >
      <Grid item xs={10} className={" write-zone-container"}>
        <TextField
          id="message"
          multiline
          fullWidth
          variant="outlined"
          name="message"
          placeholder={fieldSpec.message.placeholder}
          type={"text"}
          error={!!showErrors && !!get(validationErrors, "message")}
          autoComplete="nope"
          margin="normal"
          value={message}
          onChange={onHandleChange}
          required={fieldSpec.message.validations.required}
        />
      </Grid>
      <Grid
        item
        xs={2}
        container
        alignItems="center"
        justify="center"
        className={"write-zone-container"}
      >
        <Button
          variant="outlined"
          disabled={isSending}
          onClick={() => submitForm()}
          classes={{ root: "create-chat-room-button" }}
        >
          Send
        </Button>
        {isSending && (
          <div className={"button-progress-container"}>
            <ColorCircularProgress size={24} />
          </div>
        )}
      </Grid>
    </Grid>
  );
};

function ChatRoomDetailsComponent(props) {
  const { showRoom } = props;
  return (
    <div className={"root-create-chat-room"}>
      {!showRoom ? (
        <RenderAccessRoom {...props}></RenderAccessRoom>
      ) : (
        <RenderRoom {...props}></RenderRoom>
      )}
    </div>
  );
}

export default ChatRoomDetailsComponent;
