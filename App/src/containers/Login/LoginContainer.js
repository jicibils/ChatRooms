import React from "react";
import LoginComponent from "components/Login/LoginComponent";
import { withSnackbar } from "notistack";
import {
  errorSnackBar,
  successSnackBar,
  warnSnackBar
} from "components/SnackBar/SnackBar";
import { run, createRules } from "validation/ruleRunner";
import update from "immutability-helper";
import { FirstElementOfAnObject, queueSetState } from "utils/functions";

// REDUX
import { signin } from "reduxActions/reducers/authReducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const fieldSpec = () => ({
  email: {
    name: "Email",
    placeholder: "Email",
    validations: { required: true }
  },
  password: {
    name: "Password",
    placeholder: "8 characters as minimum",
    validations: { required: true, minLength: 8 }
  }
});

const getFieldValidations = fieldSpec => createRules(fieldSpec);

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      shouldRenderRegisterPage: false,
      fieldSpec: fieldSpec(),
      showErrors: false,
      validationErrors: {}
    };
  }

  handleChange = e => {
    if (!e.target) return;
    const { target } = e;
    const fieldName = target.id || target.name;
    const { value } = target;
    const newState = update(this.state, {
      [fieldName]: { $set: value }
    });
    newState.validationErrors = run(
      newState,
      getFieldValidations(this.state.fieldSpec)
    );
    queueSetState(this, newState);
  };

  handleClickShowPassword = () =>
    this.setState({ showPassword: !this.state.showPassword });

  onSignin = () => {
    const { email, password } = this.state;
    const { signin } = this.props;

    signin(email, password, { launchSnackBar: this.launchSnackBar });
  };

  submitForm = (
    event = { stopPropagation: () => {} },
    { validations = getFieldValidations(this.state.fieldSpec) } = {}
  ) => {
    event.stopPropagation();
    let validationErrors = run(this.state, validations);
    const errorState = { validationErrors, showErrors: true };
    const { enqueueSnackbar, closeSnackbar } = this.props;
    this.setState(
      {
        ...errorState
      },
      () => !validationErrors && this.onSignin()
    );
    if (!!validationErrors)
      return errorSnackBar(
        FirstElementOfAnObject(validationErrors),
        enqueueSnackbar,
        closeSnackbar
      );
  };

  launchSnackBar = (message, type) => {
    const { enqueueSnackbar, closeSnackbar } = this.props;
    if (type === "success")
      successSnackBar(message, enqueueSnackbar, closeSnackbar);
    else if (type === "warning")
      warnSnackBar(message, enqueueSnackbar, closeSnackbar);
    else errorSnackBar(message, enqueueSnackbar, closeSnackbar);
  };

  goToRegisterPage = () => this.props.history.push(`/register`);

  render() {
    return (
      <LoginComponent
        email={this.state.email}
        password={this.state.password}
        fieldSpec={this.state.fieldSpec}
        showPassword={this.state.showPassword}
        onHandleChange={this.handleChange}
        handleClickShowPassword={this.handleClickShowPassword}
        submitForm={this.submitForm}
        errorMessage={this.props.errorMessage}
        isFetching={this.props.isFetching}
        goToRegisterPage={this.goToRegisterPage}
        showErrors={this.state.showErrors}
        validationErrors={this.state.validationErrors}
      />
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  errorMessage: store.auth.errorMessage,
  isFetching: store.auth.isFetching
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signin
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(LoginContainer));
