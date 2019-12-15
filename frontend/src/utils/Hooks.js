import { useState, useCallback } from "react";

export const useStateObject = initialObj => {
  const [obj, setObj] = useState(initialObj);
  const setField = useCallback(
    name => value => setObj(prevObj => ({ ...prevObj, [name]: value })),
    []
  );
  const reset = useCallback(() => setObj(initialObj), []);
  return [obj, setField, reset];
};

export const useToggle = init => {
  const [state, setState] = useState(init);
  const toggleState = useCallback(() => setState(prev => !prev), []);
  return [state, toggleState];
};
