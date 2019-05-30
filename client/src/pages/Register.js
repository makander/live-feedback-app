import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { registerUser } from "../actions/auth";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    const { auth, history } = this.props;

    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
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
    const { name, email, password, password2 } = this.state;
    const { register } = this.props;

    const newUser = {
      name,
      email,
      password,
      password2
    };
    register(newUser);
  };

  render() {
    const { errors, name, email, password, password2 } = this.state;

    return (
      <div className="d-flex justify-content-center pt-2">
        <div
          className="border border-info px-5 pt-5"
          style={{ marginBottom: 8 + "rem", width: "75vh" }}
        >
          <div>
            <h1 className="text-center">Register</h1>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <div className="form-group row" style={{ marginTop: 3 + "rem" }}>
              <label htmlFor="inputName" className="col-sm-3 col-form-label">
                Name
              </label>
              <div className="col-sm-8">
                <input
                  type="name"
                  id="inputEmail3"
                  placeholder="Enter name"
                  onChange={this.onChange}
                  value={name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("form-control", {
                    invalid: errors.name
                  })}
                />
                <span className="red-text">{errors.name}</span>
              </div>
            </div>

            <div className="form-group row py-1">
              <label htmlFor="inputEmail" className="col-sm-3 col-form-label">
                Email
              </label>
              <div className="col-sm-8">
                <input
                  placeholder="Enter email"
                  onChange={this.onChange}
                  value={email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("form-control", {
                    invalid: errors.email
                  })}
                />
                <span className="red-text">{errors.email}</span>
              </div>
            </div>

            <div className="form-group row py-1">
              <label
                htmlFor="inputPassword"
                className="col-sm-3 col-form-label"
              >
                Password
              </label>
              <div className="col-sm-8">
                <input
                  placeholder="Enter password"
                  onChange={this.onChange}
                  value={password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("form-control", {
                    invalid: errors.password
                  })}
                />
                <span className="red-text">{errors.password}</span>
              </div>
            </div>

            <div className="form-group row py-1">
              <label
                htmlFor="inputPasswordConfirm"
                className="col-sm-3 col-form-label"
              >
                Confirm Password
              </label>
              <div className="col-sm-8">
                <input
                  placeholder="Confirm password"
                  onChange={this.onChange}
                  value={password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("form-control", {
                    invalid: errors.password2
                  })}
                />
                <span className="red-text">{errors.password2}</span>
              </div>
            </div>

            <div style={{ marginTop: 3 + "rem" }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Sign up
              </button>
            </div>
          </form>
          <p style={{ marginTop: 3 + "rem" }} className="text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  register: user => dispatch(registerUser(user, ownProps.history))
});

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
