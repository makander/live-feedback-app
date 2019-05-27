import React from "react";
import  { configure, shallow } from "enzyme";
import NewSession from "./NewSession";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('NewSession', () => {
  
  test("renders", () => {
    const wrapper =shallow(<NewSession />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
