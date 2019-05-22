import React, { Component } from "react";
import { connect } from "react-redux";
import { Line, Scatter } from "react-chartjs-2";

class SessionDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /* console.log(this.props.match.params.id); */
  }

  render() {
    const {
      sessionData
    } = this.props; /* 
     const hej = <h1>hejdå</h1>;
  /*   const testing = sessionData.map(data => {
      if (data.id === this.props.match.params.id) {
        data.room_data.map(roomdata => {
          return <h1>{roomdata.x}</h1>;
        });
      }
    }); */
    /*  const test = sessionData.map(data => {
      if (data.id === this.props.match.params.id) {
        data.room_data.map(roomdata => {
          return <h2>hej</h2>;
        });
      } else {
        return null;
      }
    }); */
    const xValue = [];
    const yValue = [];

    const scatterData = [];

    let timeStampAtZero;

    const session = sessionData.map(data => {
      if (data.id === this.props.match.params.id) {
        return data.room_data.map(roomdata => {
          console.log("roomdata ", roomdata);
          return (
            <h1>
              {/* {xValue.push(roomdata.x)}, {yValue.push(roomdata.y)} */}
              {scatterData.push(roomdata)}
            </h1>
          );
        });
      }
    });

    const data = {
      datasets: [
        {
          label: "Value",
          backgroundColor: "rgba(255, 0, 225, 0.75)",
          data: scatterData,
          showLine: true
        }
      ]
    };
    return (
      <div>
        <Scatter data={data} />
        <h1>SessionData</h1>
        {/* {data} */}
        {/*   {sessionData.map(data => {
          if (data.id === this.props.match.params.id) {
            return data.room_data.map(roomdata => {
              console.log("roomdata ", roomdata);
              return (
                <h1>
                  {roomdata.x}, {roomdata.y}
                </h1>
              );
            });
          }
        })} */}
      </div>
    );
  }
}

const mapDispatchToProps = () => ({});

const mapStateToProps = state => ({
  sessionData: state.auth.user.session_data
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionDetails);
