import { combineReducers } from "redux";
import drawerReducer from "./drawerReducer";
import cartReducer from "./cartReducer";
import wishListReducer from "./wishListReducer";
import { api } from "../api";

const rootReducer = combineReducers({
  drawer: drawerReducer,
  // cart: cartReducer,
  // wishList: wishListReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
