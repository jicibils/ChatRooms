import React from "react";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import HeaderComponent from "components/Header/HeaderComponent";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMultiAccounts: false,
      accountsSelected: null
    };
  }

  goToDashboard = () => this.props.history.push("/");

  render() {
    return (
      <HeaderComponent {...this.props} goToDashboard={this.goToDashboard} />
    );
  }
}

const mapStateToProps = store => ({
  user: store.auth.user
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withSnackbar(HeaderContainer)));
