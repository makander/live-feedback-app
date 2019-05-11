import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { loginUser } from "../actions/auth";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    const { auth, history } = this.props;
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props;

    if (nextProps.auth.isAuthenticated) {
      history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;
    const { login } = this.props;

    const userData = {
      email,
      password
    };

    login(userData);
  };

  render() {
    const { errors, email, password } = this.state;

    //style={{marginRight: spacing + 'em'}} when using JSX.

    return (
      <div className="d-flex justify-content-center pt-2">
        <div
          className="border border-info px-5 pt-5"
          style={{ marginBottom: 8 + "rem" }}
        >
          <div>
            <h1 className="text-center">Login</h1>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <div class="form-group row" style={{ marginTop: 3 + "rem" }}>
              <label htmlFor="inputEmail3" class="col-sm-3 col-form-label">
                Email
              </label>
              <div class="col-sm-8 p-2">
                <input
                  onChange={this.onChange}
                  value={email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("form-control", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                  autoComplete="email"
                  placeholder="Enter email"
                />
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
            </div>
            <div class="form-group row">
              <label htmlFor="inputPassword3" class="col-sm-3 col-form-label">
                Password
              </label>
              <div class="col-sm-8">
                <input
                  onChange={this.onChange}
                  value={password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("form-control", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                  autoComplete="password"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div>
              <span className="red-text">
                {errors.password}
                {errors.passwordincorrect}
              </span>
            </div>
            <div style={{ marginTop: 3 + "rem" }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Login
              </button>
            </div>
          </form>
          <p style={{ marginTop: 3 + "rem" }} className="text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(loginUser(user))
});

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
