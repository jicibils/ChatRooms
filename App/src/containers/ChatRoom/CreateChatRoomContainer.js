import React from "react";
import { run, createRules } from "validation/ruleRunner";
import update from "immutability-helper";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import CreateChatRoomComponent from "components/ChatRoom/CreateChatRoomComponent";
import { errorSnackBar, successSnackBar } from "components/SnackBar/SnackBar";
import { FirstElementOfAnObject, queueSetState } from "utils/functions";
import { AUTHENTICATION_TYPES } from "utils/types";
import { createChatRoom } from "api/services/chat-room";
import get from "lodash/get";
import keyBy from "lodash/keyBy";

// REDUX
import { updateRoomsReducer } from "reduxActions/reducers/roomsReducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const fieldSpec = () => ({
  roomName: {
    name: "Room Name",
    placeholder: "Insert the Room Name",
    validations: { required: true }
  }
});

const getFieldValidations = fieldSpec => createRules(fieldSpec);

class CreateChatRoomContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: "",
      fieldSpec: fieldSpec(),
      showErrors: false,
      validationErrors: {},
      isSaving: false
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

  onCreateChatRoom = () => {
    queueSetState(this, { isSaving: true });
    const { roomName } = this.state;
    const { user, enqueueSnackbar, closeSnackbar } = this.props;
    const chatRoomData = { roomName, user };
    createChatRoom(chatRoomData)
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

        const newRoom = keyBy(res.data.chatRoom, "id");
        this.props.updateRoomsReducer(newRoom);
        queueSetState(this, { isSaving: false, roomName: "" });
      })
      .catch(err => {
        queueSetState(this, { isSaving: false });
        console.log("err", err);
      });
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
      () => !validationErrors && this.onCreateChatRoom()
    );
    if (!!validationErrors)
      return errorSnackBar(
        FirstElementOfAnObject(validationErrors),
        enqueueSnackbar,
        closeSnackbar
      );
  };

  render() {
    return (
      <CreateChatRoomComponent
        fieldSpec={this.state.fieldSpec}
        formState={this.state}
        onHandleChange={this.handleChange}
        submitForm={this.submitForm}
        errorMessage={this.props.errorMessage}
        isSaving={this.state.isSaving}
        showErrors={this.state.showErrors}
        validationErrors={this.state.validationErrors}
      />
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateRoomsReducer }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withSnackbar(CreateChatRoomContainer)));
