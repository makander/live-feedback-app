import React from "react";
import  { configure, shallow } from "enzyme";
import SessionDetails from "./SessionDetails";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('SessionDetails', () => {
  
  test("renders", () => {
    const wrapper =shallow(<SessionDetails />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
