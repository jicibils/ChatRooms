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
import "./Register.scss";

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

class RegisterComponent extends React.Component {
  render() {
    const {
      formState,
      fieldSpec,
      onHandleChange,
      submitForm,
      showErrors,
      validationErrors,
      isSaving,
      showPassword,
      handleClickShowPassword
    } = this.props;

    return (
      <div className={"root-register"}>
        <Container className={"register-container"}>
          <Grid item xs={12} container>
            <Grid
              item
              md={8}
              container
              justify="center"
              alignItems="center"
            ></Grid>
            <Grid
              item
              xs={12}
              md={4}
              container
              justify="center"
              alignItems="center"
              className={"register-main-column"}
            >
              <Paper className={"all-width register-box"}>
                <p className={"register-title"}>Create Account</p>

                <form className={"register-form"} autoComplete="off">
                  <ThemeProvider theme={theme}>
                    <div>
                      <CustomTextField
                        name="email"
                        label={fieldSpec.email.name}
                        placeholder={fieldSpec.email.placeholder}
                        type={"text"}
                        error={!!showErrors && !!get(validationErrors, "email")}
                        className={"register-input"}
                        autoComplete="nope"
                        margin="normal"
                        variant="outlined"
                        value={formState.email}
                        onChange={onHandleChange}
                        required={fieldSpec.email.validations.required}
                      />
                    </div>
                    <div>
                      <CustomTextField
                        name="nickname"
                        label={fieldSpec.nickname.name}
                        placeholder={fieldSpec.nickname.placeholder}
                        type={"text"}
                        error={
                          !!showErrors && !!get(validationErrors, "nickname")
                        }
                        className={"register-input"}
                        autoComplete="nope"
                        margin="normal"
                        variant="outlined"
                        value={formState.nickname}
                        onChange={onHandleChange}
                        required={fieldSpec.nickname.validations.required}
                      />
                    </div>
                    <div>
                      <CustomTextField
                        name="password"
                        label={fieldSpec.password.name}
                        placeholder={fieldSpec.password.placeholder}
                        type={showPassword ? "text" : "password"}
                        error={
                          !!showErrors && !!get(validationErrors, "password")
                        }
                        className={"register-input"}
                        autoComplete="new-password"
                        margin="normal"
                        variant="outlined"
                        value={formState.password}
                        onChange={onHandleChange}
                        required={fieldSpec.password.validations.required}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                aria-label="Toggle password visibility"
                                onClick={handleClickShowPassword}
                                title={
                                  showPassword
                                    ? "Hide Password"
                                    : "Show Password"
                                }
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
                    <div>
                      <CustomTextField
                        name="passwordRepeat"
                        label={fieldSpec.passwordRepeat.name}
                        placeholder={fieldSpec.passwordRepeat.placeholder}
                        type={showPassword ? "text" : "password"}
                        error={
                          !!showErrors &&
                          !!get(validationErrors, "passwordRepeat")
                        }
                        className={"register-input"}
                        autoComplete="new-password"
                        margin="normal"
                        variant="outlined"
                        value={formState.passwordRepeat}
                        onChange={onHandleChange}
                        required={fieldSpec.passwordRepeat.validations.required}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                aria-label="Toggle password visibility"
                                onClick={handleClickShowPassword}
                                title={
                                  showPassword
                                    ? "Ocultar Contraseña"
                                    : "Mostrar Contraseña"
                                }
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
                  disabled={isSaving}
                  onClick={() => submitForm()}
                  classes={{ root: "register-button" }}
                >
                  Create Account
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

export default RegisterComponent;
