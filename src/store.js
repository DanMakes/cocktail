import appReducer from "./reducers";
import { createStore, applyMiddleware, compose } from "redux";
import { fetchCocktails, fetchIngredients } from "./services/cocktail.service";
import { loadCocktails, loadIngredients } from "./actions";
import {
  persistCurrentState,
  supportsPersistence
} from "./utilities/persistence";
import throttle from "lodash/throttle";

import thunk from "redux-thunk";

const devtools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const middlewares = compose(
  applyMiddleware(thunk),
  devtools || (a => a)
);

const store = createStore(appReducer, middlewares);

// persist parts of the store whenever it changes.
if (supportsPersistence()) {
  store.subscribe(
    throttle(() => {
      persistCurrentState(store.getState(), ["bar", "settings"]);
    })
  );
}

fetchCocktails().then(function(response) {
  store.dispatch(loadCocktails(response));
});

fetchIngredients().then(function(response) {
  store.dispatch(loadIngredients(response));
});

export default store;
