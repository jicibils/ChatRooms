import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Login from "containers/Login/LoginContainer";
import Register from "containers/Register/RegisterContainer";
import UserRoutes from "routes/userRoutes";
import get from "lodash/get";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//this function is to put whatever route for everyone like policy privacy
// const getUniversalRoutes = () => {};

const Wrapper = styled.div`
  .fade-enter {
    opacity: 0.01 !important;
  }
  .fade-enter.fade-enter-active {
    opacity: 1 !important;
    transition: opacity 300ms ease-in !important;
  }
  .fade-exit {
    opacity: 1 !important;
  }

  .fade-exit.fade-exit-active {
    opacity: 0.01 !important;
    transition: opacity 300ms ease-in !important;
  }
  div.transition-group {
    position: relative !important;
  }
  section.route-section {
    position: absolute !important;
    width: 100% !important;
    top: 0 !important;
    left: 0 !important;
  }
`;

function rootRoutes(props) {
  const { location } = props;
  return get(props, "isAuthed", false) ? (
    <div>
      <Switch>
        {/* {getUniversalRoutes()} */}
        <UserRoutes />
      </Switch>
    </div>
  ) : (
    <Wrapper>
      <TransitionGroup className="transition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 300, exit: 300 }}
          classNames="fade"
        >
          <section className="route-section">
            <Switch location={location}>
              {/* {getUniversalRoutes()} */}
              <Route exact path="/" component={Login} />;
              <Route exact path="/register" component={Register} />;
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </Wrapper>
  );
}

const mapStateToProps = store => ({
  user: store.auth.user,
  isAuthed: store.auth.isAuthed
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(rootRoutes));
