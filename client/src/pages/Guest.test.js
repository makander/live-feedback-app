import React from "react";
import  { configure, shallow } from "enzyme";
import Guest from "./Guest";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('Guest', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Guest />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
