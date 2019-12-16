// Catch errors thrown by its children components and render a message for user
import React, { Component } from "react";
import { IconButton } from "@material-ui/core";
import Sync from "@material-ui/icons/Sync";

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    console.log("ErrorBoundary -> error", error);
    this.setState({ hasError: true });
  }

  refreshPage = () => {
    if (window !== undefined) {
      window.location = "/";
    }
  };

  renderErrorBoundaryContent = () => (
    <div style={{ marginTop: 200 }}>
      <h1>{"Oops! Something went wrong"}</h1>
      <h3>{`Do not worry, you can try refreshing the page`}</h3>
      <IconButton
        aria-label="Sync"
        onClick={this.refreshPage}
        style={{ border: "2px solid black" }}
      >
        <Sync style={{ color: "black", fontSize: 60 }} />
      </IconButton>
    </div>
  );

  render() {
    return !this.state.hasError
      ? this.props.children
      : this.renderErrorBoundaryContent();
  }
}

export default ErrorBoundary;
