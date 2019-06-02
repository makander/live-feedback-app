/* eslint-disable no-undef */
import React from "react";
import  { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SessionDetails from "./SessionDetails";

configure({adapter: new Adapter()});

describe('SessionDetails', () => {
  
  test("renders", () => {
    const wrapper =shallow(<SessionDetails />);
    expect(wrapper.exists()).toBe(true);
  });

});
