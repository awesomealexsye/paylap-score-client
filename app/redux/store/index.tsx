import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer";
import { employeeApi } from "../api/employee.api";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeeApi.middleware),
});

export default store;
