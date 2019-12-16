import React from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import get from "lodash/get";

import "./Login.scss";

const styles = theme => ({});

const ColorCircularProgress = withStyles({
  root: {
    color: "rgba(255, 255, 255, 0.7)"
  }
})(CircularProgress);

const CustomTextField = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
})(TextField);

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: "rgba(255, 255, 255, 0.7)" }
  }
});

class LoginComponent extends React.Component {
  render() {
    const {
      email,
      password,
      fieldSpec,
      showPassword,
      onHandleChange,
      handleClickShowPassword,
      submitForm,
      errorMessage,
      showErrors,
      validationErrors,
      isFetching
    } = this.props;

    return (
      <div className={"root"}>
        <div className={"root-filter"}>
          <Container className={"login-container"}>
            <Grid item xs={12} container>
              <Grid
                item
                xs={12}
                container
                justify="center"
                alignItems="center"
                className={"login-main-column"}
              >
                <Paper className={"all-width login-box"}>
                  <p className={"login-title"}>Chat Rooms</p>

                  <form
                    className={styles.container}
                    noValidate
                    autoComplete="off"
                  >
                    <ThemeProvider theme={theme}>
                      <div>
                        <CustomTextField
                          name="email"
                          label={fieldSpec.email.name}
                          placeholder={fieldSpec.email.placeholder}
                          type={"text"}
                          error={
                            !!errorMessage ||
                            (!!showErrors && !!get(validationErrors, "email"))
                          }
                          className={"login-input"}
                          autoComplete="nope"
                          margin="normal"
                          variant="outlined"
                          value={email}
                          onChange={onHandleChange}
                          required={fieldSpec.email.validations.required}
                        />
                      </div>
                      <div>
                        <CustomTextField
                          name="password"
                          label={fieldSpec.password.name}
                          placeholder={fieldSpec.password.placeholder}
                          type={showPassword ? "text" : "password"}
                          error={
                            !!errorMessage ||
                            (!!showErrors &&
                              !!get(validationErrors, "password"))
                          }
                          className={"login-input"}
                          autoComplete="new-password"
                          margin="normal"
                          variant="outlined"
                          value={password}
                          onChange={onHandleChange}
                          required={fieldSpec.password.validations.required}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  aria-label="Toggle password visibility"
                                  onClick={handleClickShowPassword}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                    </ThemeProvider>
                  </form>
                  <Button
                    variant="outlined"
                    disabled={isFetching}
                    onClick={() => submitForm()}
                    classes={{ root: "login-button" }}
                  >
                    Log in
                  </Button>
                  {isFetching && (
                    <div className={"button-progress-container"}>
                      <ColorCircularProgress size={24} />
                    </div>
                  )}
                  <br />
                  <Button
                    variant="outlined"
                    disabled={isFetching}
                    onClick={() => this.props.goToRegisterPage()}
                    classes={{ root: "button-register" }}
                  >
                    Create Account
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}

export default LoginComponent;
