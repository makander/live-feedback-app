/* eslint-disable no-undef */
import React from "react";
import { shallow } from "enzyme";
import SessionDetails from "./SessionDetails"


describe("SessionDetails Component", () => {
  let wrapper;
  const location = {sessionData: {
    room_data: [
      {_id:
        "xxxxxxxxxxxxxxxxxxxxxxxx",
        x:
        "00:00:00",
        y:
        "50"}
    ]
  }}

    beforeEach(() => {
      wrapper = shallow(<SessionDetails  location={location}/>);
    });
    
    describe("If session data is available", () => {
      it("should render a Line graph component", () => {
      const Line = wrapper.find('Line')
      expect(Line.length).toEqual(1)
    });
  });
});
