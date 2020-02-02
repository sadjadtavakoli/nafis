import { GET_CLASS_TYPES_AND_CITY } from "../actions/types";

const INITIAL_VALUES = {};

export default (state = INITIAL_VALUES, action) => {
  switch (action.type) {
    case GET_CLASS_TYPES_AND_CITY:
      return { ...state, classTypesAndCity: action.payload };
    default:
      return state;
  }
};
