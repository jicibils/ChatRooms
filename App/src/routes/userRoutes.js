import React, { Fragment } from 'react';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundaryComponent';
import LayoutWrapper from 'components/Wrapper/Wrapper';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class UserRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  wrapUnderAppNavbar = elem => {
    return (
      <Fragment>
        <ErrorBoundary>{elem}</ErrorBoundary>
      </Fragment>
    );
  };

  getContent = () => {
    return <LayoutWrapper />;
  };

  render() {
    const content = this.getContent();

    return this.wrapUnderAppNavbar(content);
  }
}

const mapStateToProps = store => ({
  user: store.auth.user,
  isAuthed: store.auth.isAuthed
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRoutes);
