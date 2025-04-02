import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../../constants/config";
import StorageService from "../../lib/StorageService";


export interface Employee {
  id: number;
  name: string;
  email: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONFIG.APP_URL}/api/`,
    prepareHeaders: async (headers: Headers): Promise<Headers> => {
      const jwtToken = await StorageService.getStorage(
        CONFIG.HARDCODE_VALUES.JWT_TOKEN
      );
      if (jwtToken) {
        headers.set("Authorization", `Bearer ${jwtToken}`);
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),

  tagTypes: ["Employee","Salary","Account","Company"],

  endpoints: () => ({ }),


});

