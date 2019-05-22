import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux store
import store from "../stores";

// import fonts
import "../styles.css";

// Components
import Navbar from "./Layout/Navbar";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Pages
import { Landing, Register, Login, Dashboard } from "../pages";
import MySessions from "../pages/MySessions";
import NewSession from "../pages/NewSession";
import Guest from "../pages/Guest";
import SessionDetails from "./SessionDetails";

const App = () => (
  <Provider store={store}>
    <Router>
      <>
        <Navbar />

        <div
          style={{
            backgroundImage:
              "linear-gradient(radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100% background-blend-mode: screen;)"
          }}
        >
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/guest/:roomId?" component={Guest} />
          {/* <Route
            exact
            path="/my-sessions/:session.id?"
            component={SessionDetails}
          /> */}
          <Switch>
            <PublicRoute exact path="/" component={Landing} />
          </Switch>
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/my-sessions" component={MySessions} />
            <PrivateRoute exact path="/new-session" component={NewSession} />
            {/* <PrivateRoute
              exact
              path="/my-sessions/:session.id"
              component={SessionDetails}
            /> */}
            <PrivateRoute
              exact
              path="/my-sessions/:id"
              component={SessionDetails}
            />
            {/*  <PrivateRoute {}
            <Route {...rest} render={props => (
            <FadeIn>
              <Component {...props}/>
            </FadeIn>
          )}/> */}
          </Switch>
        </div>
      </>
    </Router>
  </Provider>
);

export default App;
