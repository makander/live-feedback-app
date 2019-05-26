import React from "react";
import  { configure, shallow } from "enzyme";
import Chart from "./Chart";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe('Chart', () => {
  
  test("renders", () => {
    const wrapper =shallow(<Chart />);
    expect(wrapper.exists()).toBe(true);
  });


  
});
