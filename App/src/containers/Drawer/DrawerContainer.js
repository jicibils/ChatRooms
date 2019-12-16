import React from "react";
import { withRouter } from "react-router-dom";
import DrawerComponent from "components/Drawer/DrawerComponent";
import { getChatRooms } from "api/services/chat-room";
import keyBy from "lodash/keyBy";

// REDUX
import { updateRoomsReducer } from "reduxActions/reducers/roomsReducer";
import { signout } from "reduxActions/reducers/authReducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const rooms = keyBy((await getChatRooms()).data, "id");
    this.props.updateRoomsReducer(rooms);
  }

  onSignout = () => {
    const { signout } = this.props;
    signout();
    this.props.history.push("/");
  };

  goTo = pageName => this.props.history.push(`/${pageName}`);

  render() {
    const { user } = this.props;
    return (
      <DrawerComponent
        {...this.props}
        user={user}
        onSignout={this.onSignout}
        goTo={this.goTo}
        rooms={this.props.rooms}
      />
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  rooms: store.rooms.rooms
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signout,
      updateRoomsReducer
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DrawerContainer));
