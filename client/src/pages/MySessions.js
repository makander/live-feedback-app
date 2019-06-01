import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import cx from "classnames";
import { sessionDetails } from "../actions/room";
import withAuth from "../hocs/withAuth";

function MySessions() {
  const [renderState, setRenderState] = useState([]);
  const [errorState, setErrorState] = useState(null);

  const [viewPortWidth, setViewPortWidth] = useState(window.innerWidth);
  const errorOrNoSessions = errorState ? (
    <div>
      <h5>Your sessions could not be found, there was an error...</h5>
    </div>
  ) : (
    <p>You have no saved sessions</p>
  );
  const getSessions = async () => {
    try {
      const result = await axios(
        `${process.env.REACT_APP_API_BASE_URL}/api/my-sessions`
      );
      console.table(result);
      setRenderState(result.data.data);
    } catch (err) {
      setErrorState(err.response.statusText);
      console.log(errorState);
      //  dispatch an error msg and render to the client
    }
  };

  useEffect(() => {
    getSessions();
  }, []);

  const deleteSession = sessionId => {
    console.log("Delete");
    axios
      .delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/my-sessions/${sessionId}`
      )
      .then(res => {
        console.log(res);
        getSessions();
      })
      .then()
      .catch(error => {
        // handle error
        console.log(error);
      });
  };

  const convertDate = data => {
    const datum = new Date(data).toLocaleString("sv-SE");
    return datum;
  };

  window.addEventListener("resize", () => {
    const currentViewPortWidth = window.innerWidth;
    if (currentViewPortWidth) {
      setViewPortWidth(currentViewPortWidth);
    }
  });
  return (
    <div className="d-flex justify-content-center pt-2">
      <div
        className="border border-info px-5 pt-5 shadow-sm"
        style={{ marginBottom: "8rem" }}
      >
        <div className="p-2 container">
          {renderState.length ? (
            <table className="table class table-hover">
              <thead className="thead-dark">
                <tr>
                  <th
                    scope="col"
                    className={cx({
                      "d-none": viewPortWidth < 360
                    })}
                  >
                    Date
                  </th>
                  <th scope="col">Session Name</th>
                </tr>
              </thead>
              <tbody>
                {renderState.map(room => {
                  return (
                    <tr key={room._id}>
                      <td
                        className={cx("mx-auto", {
                          "d-none": viewPortWidth < 360
                        })}
                      >
                        {convertDate(room.date)}
                      </td>
                      <td className="py-2 mx-auto">
                        <div className="d-flex">
                          <Link
                            to={{
                              pathname: `/my-sessions/${room._id}`,
                              sessionData: room
                            }}
                            role="button"
                            className="btn btn-outline-primary btn"
                          >
                            {room.room_name.substring(25)}
                          </Link>
                          <form>
                            <button
                              className="btn btn-danger btn ml-1"
                              type="button"
                              onClick={() => deleteSession(`${room._id}`)}
                            >
                              X
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            errorOrNoSessions
          )}
          <div className="d-flex justify-content-center pb-3">
            <Link
              to="/dashboard"
              role="button"
              className="btn btn-outline-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  sessionDetails: () => {
    dispatch(sessionDetails());
  }
});

const mapStateToProps = state => ({
  session_details: state.room.session_details,
  user_id: state.auth.user.sub
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(MySessions)));
