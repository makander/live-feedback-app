import React from "react";
import  { configure, shallow } from "enzyme";
import ProgressBar from "./ProgressBar";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('ProgressBar', () => {
  
  test("renders", () => {
    const wrapper =shallow(<ProgressBar />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
