import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import {
  sessionStarted,
  sessionStopped,
  sessionDetails
} from "../actions/room";
import withAuth from "../hocs/withAuth";

function MySessions(props) {
  useEffect(() => {
    const fetchSessions = axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/users/sessions`
    );
    console.log(fetchSessions);
  });

  console.log(props);
  return <h1>hello wurld</h1>;
  // const { session_data } = props;
  // return (
  //   <div className="d-flex justify-content-center pt-2">
  //     <div
  //       className="border border-info px-5 pt-5"
  //       style={{ marginBottom: "8rem" }}
  //     >
  //       <div className="p-2">
  //         <h1 className="text-center">My sessions</h1>
  //         {session_data.session_data.length ? (
  //           <ul className="list-unstyled py-2">
  //             {session_data.session_data.map(data => {
  //               return (
  //                 <div>
  //                   <Link
  //                     to={`/my-sessions/${data.id}`}
  //                     role="button"
  //                     className="btn btn-outline-primary btn"
  //                   >
  //                     {data.id}
  //                   </Link>
  //                 </div>
  //               );
  //             })}
  //           </ul>
  //         ) : (
  //           <p>You have no saved sessions</p>
  //         )}
  //         <div className="d-flex justify-content-center pb-3">
  //           <Link
  //             to="/dashboard"
  //             role="button"
  //             className="btn btn-outline-secondary"
  //           >
  //             My Sessions
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

const mapDispatchToProps = dispatch => ({
  sessionDetails: () => {
    dispatch(sessionDetails());
  }
});

const mapStateToProps = state => ({
  session_data: state.auth.user,
  session_details: state.room.session_details,
  user_id: state.auth.user.sub
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(MySessions)));
