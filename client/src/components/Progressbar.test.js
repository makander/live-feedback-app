/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ProgressBar from "./ProgressBar";

configure({adapter: new Adapter()});

describe('ProgressBar', () => {
  
  test("renders", () => {
    const wrapper =shallow(<ProgressBar />);
    expect(wrapper.exists()).toBe(true);
  });

});
