import React from "react";
import  { configure, shallow } from "enzyme";
import App from "./App";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('App', () => {
  
  test("renders", () => {
    const wrapper =shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
