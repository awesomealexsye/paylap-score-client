import { MessagesService } from "../../lib/MessagesService";
import { api } from ".";

/**
 * Employee interface defines the structure of an employee object.
 */
export interface Employee {
  id: number;
  name: string;
  email: string;
}

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees
    getEmployees: builder.query<
      Employee,
      { user_id: string | null; auth_key: string | null }
    >({
      query: ({ user_id, auth_key }) => {
        if (!user_id || !auth_key) {
          // You could either throw an error, or return a default/fallback URL.
          console.log(`user id: ${user_id}`);
          throw new Error("Missing required authentication parameters.");
        }
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
          MessagesService.commonMessage("Employee created successfully", "SUCCESS");
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

          MessagesService.commonMessage("Employee updated successfully", "SUCCESS");
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
  //All Query

  useGetEmployeesQuery,
  useGetEmployeeDetailsQuery,

  //All Mutation

  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
