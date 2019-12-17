import React from "react";
import { run, createRules } from "validation/ruleRunner";
import update from "immutability-helper";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import ChatRoomDetailsComponent from "components/ChatRoom/ChatRoomDetailsComponent";
import Spinner from "components/Spinner/Spinner";
import { errorSnackBar, successSnackBar } from "components/SnackBar/SnackBar";

import {
  FirstElementOfAnObject,
  queueSetState,
  getIsOwner,
  getIsParticipant
} from "utils/functions";
import { AUTHENTICATION_TYPES } from "utils/types";

import get from "lodash/get";
import find from "lodash/find";
import keyBy from "lodash/keyBy";
import slice from "lodash/slice";
import size from "lodash/size";
import map from "lodash/map";

import { addParticipantToChatRoom } from "api/services/chat-room";
import { getMessages, createMessage, callBot } from "api/services/messages";

// REDUX
import { updateRoomsReducer } from "reduxActions/reducers/roomsReducer";
import {
  updateMessagesReducer,
  loadMessagesReducer
} from "reduxActions/reducers/messagesReducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const fieldSpec = () => ({
  message: {
    name: "Message",
    placeholder: "Write a message",
    validations: { required: true }
  }
});

const getFieldValidations = fieldSpec => createRules(fieldSpec);

class ChatRoomDetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isJoining: false,
      isSending: false,
      selectedRoom: null,
      showRoom: false,
      messages: [],
      fieldSpec: fieldSpec(),
      showErrors: false,
      validationErrors: {},
      message: ""
    };
  }

  async componentDidMount() {
    await this.loadRoom();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id)
      await this.loadRoom();
  }

  loadRoom = async () => {
    if (!get(this.props, "match.params.id")) return;
    const roomId = this.props.match.params.id;
    const selectedRoom = find(this.props.rooms, { id: +roomId });
    if (!selectedRoom) return;
    const messages = keyBy((await getMessages({ roomId })).data, "id");

    this.props.loadMessagesReducer(messages);
    queueSetState(this, {
      selectedRoom,
      isLoading: false,
      showRoom: false,
      messages
    });
  };

  handleChange = e => {
    if (!e.target) return;
    const { target } = e;
    const fieldName = target.name || target.id;
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
      () => !validationErrors && this.onCreateMessage()
    );
    if (!!validationErrors)
      return errorSnackBar(
        FirstElementOfAnObject(validationErrors),
        enqueueSnackbar,
        closeSnackbar
      );
  };

  onCreateMessage = () => {
    queueSetState(this, { isSending: true });
    const { selectedRoom, message } = this.state;
    const { user, enqueueSnackbar, closeSnackbar } = this.props;
    const messageData = { roomId: selectedRoom.id, user, message };
    if (message === "/stock") {
      return callBot(messageData)
        .then(res => {
          if (get(res, "data.type") !== AUTHENTICATION_TYPES.SUCCESS) {
            queueSetState(this, { isSending: false });
            return errorSnackBar(
              get(res, "data.message", "Error!"),
              enqueueSnackbar,
              closeSnackbar
            );
          }
          const newMessage = keyBy(res.data.message, "id");
          this.props.updateMessagesReducer(newMessage);
          queueSetState(this, { isSending: false, message: "" });
        })
        .catch(err => {
          queueSetState(this, { isSending: false });
          console.log("err", err);
        });
    }
    createMessage(messageData)
      .then(res => {
        if (get(res, "data.type") !== AUTHENTICATION_TYPES.SUCCESS) {
          queueSetState(this, { isSending: false });
          return errorSnackBar(
            get(res, "data.message", "Error!"),
            enqueueSnackbar,
            closeSnackbar
          );
        }
        const newMessage = keyBy(res.data.message, "id");
        this.props.updateMessagesReducer(newMessage);
        queueSetState(this, { isSending: false, message: "" });
      })
      .catch(err => {
        queueSetState(this, { isSending: false });
        console.log("err", err);
      });
  };

  toggleShowRoom = () =>
    queueSetState(this, { showRoom: !this.state.showRoom });

  onAddParticipant = () => {
    queueSetState(this, { isJoining: true });
    const { user, enqueueSnackbar, closeSnackbar } = this.props;
    const data = {
      roomId: this.state.selectedRoom.id,
      newParticipantId: user.id
    };
    addParticipantToChatRoom(data)
      .then(res => {
        if (get(res, "data.type") !== AUTHENTICATION_TYPES.SUCCESS) {
          queueSetState(this, { isJoining: false });
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

        const updatedRoom = keyBy(res.data.chatRoom, "id");
        this.props.updateRoomsReducer(updatedRoom);
        queueSetState(this, { isJoining: false, showRoom: true });
      })
      .catch(err => {
        queueSetState(this, { isJoining: false });
        console.log("err", err);
      });
  };

  getIsOwnerOrParticipant = () => {
    const userId = this.props.user.id;
    const { selectedRoom } = this.state;
    return (
      getIsOwner(userId, selectedRoom) || getIsParticipant(userId, selectedRoom)
    );
  };

  render() {
    if (this.state.isLoading) return <Spinner />;
    const { messages } = this.props;
    const messagesSize = size(messages);

    const messagesToShow =
      messagesSize > 50
        ? slice(map(messages), messagesSize - 50)
        : this.props.messages;

    return (
      <ChatRoomDetailsComponent
        selectedRoom={this.state.selectedRoom}
        user={this.props.user}
        isOwnerOrParticipant={this.getIsOwnerOrParticipant()}
        isOwner={getIsOwner(this.props.user.id, this.state.selectedRoom)}
        toggleShowRoom={this.toggleShowRoom}
        showRoom={this.state.showRoom}
        onAddParticipant={this.onAddParticipant}
        isJoining={this.state.isJoining}
        isSending={this.state.isSending}
        messages={messagesToShow}
        fieldSpec={this.state.fieldSpec}
        message={this.state.message}
        onHandleChange={this.handleChange}
        submitForm={this.submitForm}
        errorMessage={this.props.errorMessage}
        showErrors={this.state.showErrors}
        validationErrors={this.state.validationErrors}
      />
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  rooms: store.rooms.rooms,
  messages: store.messages.messages
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { updateRoomsReducer, updateMessagesReducer, loadMessagesReducer },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withSnackbar(ChatRoomDetailsContainer)));
