import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import appReducer from "./app/appReducer";
import blockchainReducer from "./blockchain/blockchainReducer";
import dataReducer from "./data/dataReducer";
import formReducer from "./minting/formReducer"

const rootReducer = combineReducers({
  app: appReducer,
  blockchain: blockchainReducer,
  data: dataReducer,
  form: formReducer
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const store = configureStore();

export default store;
