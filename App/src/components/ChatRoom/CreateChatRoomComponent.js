import React from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
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

class CreateChatRoomComponent extends React.Component {
  render() {
    const {
      formState,
      fieldSpec,
      onHandleChange,
      submitForm,
      showErrors,
      validationErrors,
      isSaving
    } = this.props;

    return (
      <div className={"root-create-chat-room"}>
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
                <p className={"create-chat-room-title"}>New Chat Room</p>

                <form className={"create-chat-room-form"} autoComplete="off">
                  <ThemeProvider theme={theme}>
                    <div>
                      <CustomTextField
                        name="roomName"
                        label={fieldSpec.roomName.name}
                        placeholder={fieldSpec.roomName.placeholder}
                        type={"text"}
                        error={
                          !!showErrors && !!get(validationErrors, "roomName")
                        }
                        className={"create-chat-room-input"}
                        autoComplete="nope"
                        margin="normal"
                        variant="outlined"
                        value={formState.roomName}
                        onChange={onHandleChange}
                        required={fieldSpec.roomName.validations.required}
                      />
                    </div>
                  </ThemeProvider>
                </form>

                <Button
                  variant="outlined"
                  disabled={isSaving}
                  onClick={() => submitForm()}
                  classes={{ root: "create-chat-room-button" }}
                >
                  Create Chat Room
                </Button>
                {isSaving && (
                  <div className={"button-progress-container"}>
                    <ColorCircularProgress size={24} />
                  </div>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default CreateChatRoomComponent;
