import { combineReducers } from "redux";
import drawerReducer from "./drawerReducer";
import cartReducer from "./cartReducer";
import wishListReducer from "./wishListReducer";
import { employeeApi } from "../api/employee.api";

const rootReducer = combineReducers({
  drawer: drawerReducer,
  cart: cartReducer,
  wishList: wishListReducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
});

export default rootReducer;
