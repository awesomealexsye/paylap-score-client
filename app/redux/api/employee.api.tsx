import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../../constants/config";
import StorageService from "../../lib/StorageService";
import { MessagesService } from "../../lib/MessagesService";
import { useEffect, useState } from "react";

/**
 * Employee interface defines the structure of an employee object.
 */
export interface Employee {
  id: number;
  name: string;
  email: string;
}

/**
 * RTK Query API slice for employee operations.
 */
export const employeeApi = createApi({
  reducerPath: "employeeApi",
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

  tagTypes: ["Employee"],

  endpoints: (builder) => ({
    // Get all employees
    getEmployees: builder.query<
      Employee,
      { user_id: string | null; auth_key: string | null }
    >({
      query: ({ user_id, auth_key }) => {
        return `employee?user_id=${user_id}&auth_key=${auth_key}`;
      },
      providesTags: ["Employee"],
    }),

    // Get employee details by ID with user_id and auth_key query parameters
    getEmployeeDetails: builder.query<
      Employee,
      { id: any; user_id: string | null; auth_key: string | null }
    >({
      query: ({ id, user_id, auth_key }) => {
        return `employee/${id}?user_id=${user_id}&auth_key=${auth_key}`;
      },
      providesTags: ["Employee"],
    }),

    // Create a new employee
    createEmployee: builder.mutation<Employee, Partial<Employee>>({
      query: (employee) => ({
        url: "employee",
        method: "POST",
        body: employee,
      }),
      invalidatesTags: ["Employee"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Employee created successfully");
        } catch (error) {
          console;
          MessagesService.commonMessage("Employee creation failed");
        }
      },
    }),

    // Update an existing employee
    updateEmployee: builder.mutation<Employee, Partial<Employee>>({
      query: (employee) => ({
        url: `employee/${employee.id}`,
        method: "PUT",
        body: employee,
      }),
      invalidatesTags: ["Employee"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;

          MessagesService.commonMessage("Employee updated successfully");
        } catch (error) {
          MessagesService.commonMessage("Employee update failed");
        }
      },
    }),

    // Delete an employee by ID
    deleteEmployee: builder.mutation<
      { success: boolean; employee?: Employee },
      { id: number; employee?: Partial<Employee> }
    >({
      query: ({ id, employee }) => ({
        url: `employee/${id}`,
        method: "DELETE",
        body: employee, // Remove or adjust the body if your API doesn't expect one for DELETE requests.
      }),
      // Invalidate the employee list on deletion.
      invalidatesTags: ["Employee"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Employee deleted successfully");
        } catch (error) {
          console.error("Error deleting employee:", error);
          MessagesService.commonMessage("Employee deletion failed");
        }
      },
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailsQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
