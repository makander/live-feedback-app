/* eslint-disable no-undef */
import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import { AuthLinks } from "./AuthLinks";

const initialState = {};
const mockStore = configureStore();;
let store;

describe("Login Component", () => {
  let wrapper;

  const mockLogout = jest.fn();
  
    // pass the mock function as the logout prop

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = shallow(<AuthLinks store={store} logout={mockLogout} />);
    });

  describe("When the logout button is pressed", () => {
    it("should call the mock logout function", () => {
      const Logout = wrapper.find('Link[children="Logout"]')
      Logout.simulate('click', {preventDefault() {}});
      expect(mockLogout.mock.calls.length).toEqual(1)
    });
  });
});
