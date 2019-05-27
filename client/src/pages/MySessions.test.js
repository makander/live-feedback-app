import React from "react";
import  { configure, shallow } from "enzyme";
import MySessions from "./MySessions";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('MySessions', () => {
  
  test("renders", () => {
    const wrapper =shallow(<MySessions />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
