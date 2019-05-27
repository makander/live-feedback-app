import React from "react";
import  { configure, shallow } from "enzyme";
import LiveSession from "./LiveSession";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('LiveSession', () => {
  
  test("renders", () => {
    const wrapper =shallow(<LiveSession />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
