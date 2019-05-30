import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { sessionDetails } from "../actions/room";
import withAuth from "../hocs/withAuth";

function MySessions() {
  const [renderState, setRenderState] = useState();

  const getSessions = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/my-sessions`)
      .then(response => {
        setRenderState(response.data.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .finally(() => {
        // always executed
      });
  };

  useEffect(() => {
    if (typeof renderState !== `object`) {
      getSessions();
    }
  });

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

  const TimeConverter = date => {
    const convertedDate = date.toLocaleTimeString("en-GB");
    console.log(convertedDate);
  };

  return (
    <div className="d-flex justify-content-center pt-2">
      <div
        className="border border-info px-5 pt-5"
        style={{ marginBottom: "8rem" }}
      >
        <div className="p-2">
          {renderState ? (
            <table className="table class table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Session Name</th>
                </tr>
              </thead>
              <tbody>
                {renderState.map(data => {
                  return (
                    <tr key={data._id}>
                      <td className="mx-auto">{TimeConverter(data.date)}</td>
                      <td className="py-2 mx-auto">
                        <div className="d-flex">
                          <Link
                            to={{
                              pathname: `/my-sessions/${data._id}`,
                              sessionData: data
                            }}
                            role="button"
                            className="btn btn-outline-primary btn"
                          >
                            {data.room_name.substring(25)}
                          </Link>
                          <form>
                            <button
                              className="btn btn-danger btn ml-1"
                              type="button"
                              onClick={e => deleteSession(`${data._id}`)}
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
            <p>You have no saved sessions</p>
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
