import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import { Navbar } from "./Navbar";

const initialState = {
  isAuthenticated: false
};
const mockStore = configureStore();;
let store;

describe("Navbar Component", () => {
  let wrapper;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<Navbar store={store} auth={{"isAuthenticated":false}}/>)
    });

  describe("When the user is logged out", () => {
    it("should render the Links component", () => {
    
      expect(wrapper.find("Links").length).toBe(1)
    });
  });
});