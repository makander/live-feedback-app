/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Chart from "./Chart";

configure({adapter: new Adapter()});

describe('Chart', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Chart />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
