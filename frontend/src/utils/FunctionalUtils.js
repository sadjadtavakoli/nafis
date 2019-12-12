import * as ActionTypes from "../actions/types";

export const createAction = type => (...argNames) => {
  return (...args) => {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
};

export const compose = (...fns) =>
  fns.reduceRight(
    (prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
    value => value
  );

export const createFetchAction = actionType =>
  compose(createAction, ActionTypes.FETCH)(actionType)();
export const createSucssAction = actionType =>
  compose(createAction, ActionTypes.SUCSS)(actionType)("payload");
export const createFaildAction = actionType =>
  compose(createAction, ActionTypes.FAILD)(actionType)("error");

export const updateObject = (oldObject, newValues) =>
  Object.assign({}, oldObject, newValues);

export const updateItemInArray = (array, itemId, updateItemCallback) =>
  array.map(item => (item.pk !== itemId ? item : updateItemCallback(item)));

export const createReducer = (initialState, handlers) => (
  state = initialState,
  action
) =>
  handlers.hasOwnProperty(action.type)
    ? handlers[action.type](state, action)
    : state;

export const isEmptyObject = obj => {
  return (
    obj === undefined ||
    (Object.keys(obj).length === 0 && obj.constructor === Object)
  );
};
