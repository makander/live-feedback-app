import React from "react";
import  { configure, shallow } from "enzyme";
import Navbar from "./Navbar";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('Navbar', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Navbar />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
