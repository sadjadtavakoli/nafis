import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
// import * as serviceWorker from './serviceWorker';
import { server } from "./apis/server";

import ReduxToastr from "react-redux-toastr";

import reducers from "./reducers";
import App from "./components/App";

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(
      reduxThunk.withExtraArgument({
        api: server(localStorage.getItem("token"))
      })
    )
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ReduxToastr
      timeOut={4000}
      newestOnTop={false}
      preventDuplicates
      position="top-right"
      getState={state => state.toastr} // This is the default
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      progressBar
      closeOnToastrClick
    />
    <App />
  </Provider>,
  document.querySelector("#root")
);
