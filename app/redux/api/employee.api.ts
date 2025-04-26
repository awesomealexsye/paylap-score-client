import { MessagesService } from "../../lib/MessagesService";
import { api } from ".";

/**
 * Employee interface defines the structure of an employee object.
 */
export interface Employee {
  id: number;
  name: string;
  email: string;
  // Optionally, include company_id if returned by the API.
  company_id?: string;
}

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees, now with company_id parameter
    getEmployees: builder.query<
      Employee[],
      {
        user_id: string | null;
        auth_key: string | null;
        company_id: string | null;
      }
    >({
      query: ({ user_id, auth_key, company_id }) => {
        if (!user_id || !auth_key || !company_id) {
          console.log(`Missing parameters: user_id: ${user_id}, auth_key: ${auth_key}, company_id: ${company_id}`);
          throw new Error("Missing required authentication parameters or company_id.");
        }
        return `employee?user_id=${user_id}&auth_key=${auth_key}&company_id=${company_id}`;
      },
      providesTags: ["Employee"],
    }),

    // Get employee details by ID with user_id and auth_key query parameters (company_id not required here)
    getEmployeeDetails: builder.query<
      Employee,
      { id: any; user_id: string | null; auth_key: string | null, company_id: string | null }
    >({
      query: ({ id, user_id, auth_key, company_id }) => {
        return `employee/${id}?user_id=${user_id}&auth_key=${auth_key}&company_id=${company_id}`;
      },
      providesTags: ["Employee"],
    }),

    // Create a new employee, now with company_id parameter passed in the body.
    createEmployee: builder.mutation<Employee, Partial<Employee> & { company_id: string }>({
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
          console.error(error);
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
        body: employee,
      }),
      invalidatesTags: ["Employee"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Employee deleted successfully", "SUCCESS");
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