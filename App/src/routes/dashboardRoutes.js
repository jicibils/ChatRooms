import React, { Fragment } from "react";
import PrivateRoute from "routes/PrivateRoute";
import Home from "containers/Home/HomeContainer";
import CreateChatRoomContainer from "containers/ChatRoom/CreateChatRoomContainer";
import ChatRoomDetailsContainer from "containers/ChatRoom/ChatRoomDetailsContainer";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class DashboardRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isAuthed } = this.props;
    return (
      <Fragment>
        <PrivateRoute
          path="/"
          component={Home}
          authed={isAuthed}
          exact
          redirectTo={"/"}
        />
        <PrivateRoute
          path="/create-chat-room"
          component={CreateChatRoomContainer}
          authed={isAuthed}
          exact
          redirectTo={"/"}
        />
        <PrivateRoute
          path="/chat-room/:id"
          component={ChatRoomDetailsContainer}
          authed={isAuthed}
          redirectTo={"/"}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  isAuthed: store.auth.isAuthed
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRoutes);
