import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { registerUser } from "../actions/auth";

class Register extends Component {
  constructor(props) {
    super(props);
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
      <div className="d-flex justify-content-center pt-2 ">
        <div
          className="border border-info px-5 pt-5"
          style={{ marginBottom: "8rem", width: "90vh" }}
        >
          <div>
            <h1 className="text-center">Register</h1>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <div className="form-group row" style={{ marginTop: "3rem" }}>
              <div className="col-sm-12">
                <label
                  id="name"
                  htmlFor="name"
                  className="col-sm-12 col-form-label"
                >
                  Name
                  <input
                    type="name"
                    id="name"
                    placeholder="Enter name"
                    onChange={this.onChange}
                    value={name}
                    error={errors.name}
                    className={classnames("form-control", {
                      invalid: errors.name
                    })}
                  />
                </label>
                <span className="text-danger">{errors.name}</span>
              </div>
            </div>

            <div className="form-group row py-1">
              <div className="col-sm-12">
                <label
                  id="inputEmailLabel"
                  htmlFor="email"
                  className="col-sm-12 col-form-label"
                >
                  Email
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
                  <span className="text-danger">{errors.email}</span>
                </label>
              </div>
            </div>

            <div className="form-group row py-1">
              <div className="col-sm-12">
                <label htmlFor="password" className="col-sm-12 col-form-label">
                  Password
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
                  <span className="text-danger">{errors.password}</span>
                </label>
              </div>
            </div>

            <div className="form-group row py-1">
              <div className="col-sm-12">
                <label htmlFor="password2" className="col-sm-12 col-form-label">
                  Confirm Password
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
                  <span className="text-danger">{errors.password2}</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: "3rem" }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Sign up
              </button>
            </div>
          </form>
          <p style={{ marginTop: "3rem" }} className="text-center">
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
