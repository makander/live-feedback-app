import React, { Component } from "react";
import PropTypes from "prop-types";
import { getConfirm, loggedIn, logout } from "../utils/AuthHelper";

/* A higher order component is frequently written as a function that returns a class. */
export default function withAuth(AuthComponent) {
  class AuthWrapped extends Component {
    state = {
      confirm: null,
      loaded: false
    };

    /* In the componentDidMount, we would want to do a couple of important tasks in order to verify the current users authentication status
        prior to granting them enterance into the app. */
    componentDidMount() {
      const { history } = this.props;
      if (!loggedIn()) {
        history.push("/login");
      } else {
        /* Try to get confirmation message from the Auth helper. */
        try {
       getConfirm().then(response => {
      if(response.data.ok) {
        this.setState({
          confirm: true,
          loaded: true
        });
      }
      });
        } catch (err) {
          /* Oh snap! Looks like there's an error so we'll print it out and log the user out for security reasons. */
          logout();
          history.replace("/login");
        }
      }
    }

    render() {
      const { loaded, confirm } = this.state;
      const { history } = this.props;

      if (loaded === true) {
        if (confirm) {
          return (
            /* component that is currently being wrapper(App.js) */
            <AuthComponent
              {...this.props}
              history={history}
              confirm={confirm}
            />
          );
        }
        return null;
      }
      return null;
    }
  }

  AuthWrapped.propTypes = {
    history: PropTypes.object.isRequired
  };

  return AuthWrapped;
}
