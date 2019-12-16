import React, { Fragment } from "react";
import RegisterComponent from "components/Register/RegisterComponent";
import { run, createRules } from "validation/ruleRunner";
import update from "immutability-helper";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import HeaderContainer from "containers/Header/HeaderContainer";
import { errorSnackBar, successSnackBar } from "components/SnackBar/SnackBar";
import { registerUser } from "api/services/register";
import { FirstElementOfAnObject, queueSetState } from "utils/functions";
import { AUTHENTICATION_TYPES } from "utils/types";
import get from "lodash/get";

// REDUX
import { signin } from "reduxActions/reducers/authReducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const fieldSpec = () => ({
  email: {
    name: "Email",
    placeholder: "Insert Your Email",
    validations: { required: true }
  },
  nickname: {
    name: "Nickname",
    placeholder: "Insert Your Nickname",
    validations: { required: true }
  },
  password: {
    name: "Password",
    placeholder: "8 characters as minimum",
    validations: { required: true, minLength: 8 }
  },
  passwordRepeat: {
    name: "Repeat the Password",
    placeholder: "Repeat the Password",
    validations: { required: true, minLength: 8 }
  }
});

const getFieldValidations = fieldSpec => createRules(fieldSpec);

class RegisterContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      nickname: "",
      password: "",
      passwordRepeat: "",
      fieldSpec: fieldSpec(),
      showErrors: false,
      validationErrors: {},
      isSaving: false,
      showPassword: false
    };
  }

  handleClickShowPassword = () =>
    this.setState({ showPassword: !this.state.showPassword });

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

  onSignup = () => {
    queueSetState(this, { isSaving: true });
    const { password, email, nickname } = this.state;
    const { signin, enqueueSnackbar, closeSnackbar } = this.props;
    const userData = { email, password, nickname };
    registerUser(userData)
      .then(res => {
        if (get(res, "data.type") !== AUTHENTICATION_TYPES.SUCCESS) {
          queueSetState(this, { isSaving: false });
          return errorSnackBar(
            get(res, "data.message", "Error!"),
            enqueueSnackbar,
            closeSnackbar
          );
        }

        successSnackBar(
          get(res, "data.message", "Operación Exitosa!"),
          enqueueSnackbar,
          closeSnackbar
        );
        const userObj = res.data.userObj;
        signin("", "", { isFromRegister: true, userObj });
        this.goToLoginPage();
      })
      .catch(err => console.log("err", err));
  };

  checkIfPasswordsAreEqual = () => {
    const { password, passwordRepeat } = this.state;
    return password !== passwordRepeat;
  };

  submitForm = (
    event = { stopPropagation: () => {} },
    { validations = getFieldValidations(this.state.fieldSpec) } = {}
  ) => {
    event.stopPropagation();
    let validationErrors = run(this.state, validations);
    const errorState = { validationErrors, showErrors: true };
    const { enqueueSnackbar, closeSnackbar } = this.props;
    if (this.checkIfPasswordsAreEqual())
      validationErrors = {
        ...validationErrors,
        passwordsEqual: "The Passwords must be equal"
      };
    this.setState(
      {
        ...errorState
      },
      () => !validationErrors && this.onSignup()
    );
    if (!!validationErrors)
      return errorSnackBar(
        FirstElementOfAnObject(validationErrors),
        enqueueSnackbar,
        closeSnackbar
      );
  };

  goToLoginPage = () => this.props.history.push(`/`);

  render() {
    return (
      <Fragment>
        <HeaderContainer
          open={false}
          showOpenDrawerButton={false}
          showBackButton={true}
        />
        <RegisterComponent
          user={this.state.user}
          fieldSpec={this.state.fieldSpec}
          formState={this.state}
          onHandleChange={this.handleChange}
          submitForm={this.submitForm}
          errorMessage={this.props.errorMessage}
          isSaving={this.state.isSaving}
          goToLoginPage={this.goToLoginPage}
          showErrors={this.state.showErrors}
          validationErrors={this.state.validationErrors}
          showPassword={this.state.showPassword}
          handleClickShowPassword={this.handleClickShowPassword}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  errorMessage: store.auth.errorMessage
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
)(withRouter(withSnackbar(RegisterContainer)));
