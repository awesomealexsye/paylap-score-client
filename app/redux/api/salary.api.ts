import { MessagesService } from "../../lib/MessagesService";
import { api } from ".";


export interface Employee {
  id: number;
  name: string;
  email: string;
}
interface UpdateSalaryInput {
  auth_key: string;
  basic_salary: number;
  company_id: number;
  deduction: number;
  id: number;
  salary_components: {
    amount: string;
    name: string;
  }[];
  status: string;
  total_salary: number;
  user_id: string;
}

export const salaryApi = api.injectEndpoints({
  endpoints: (builder) => ({
   
    // Create a new salary
    createSalary: builder.mutation<Employee, Partial<Employee>>({
      query: (employee) => ({
        url: "hrm/salary/create",
        method: "POST",
        body: employee,
      }),
      invalidatesTags: ["Salary"],
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
    getSalaryDetails: builder.mutation<Employee, Partial<Employee>>({
      query: (employee) => ({
        url: `hrm/salary/get-details`,
        method: "POST",
        body: employee,
      }),
      invalidatesTags: ["Salary"],
    }),


    
updateSalary: builder.mutation<
  { success: boolean; salary?: any },
  UpdateSalaryInput
>({
  query: (payload) => ({
    url: `hrm/salary/update`,
    method: "POST",
    body: payload,
  }),
  invalidatesTags: ["Salary"],
  async onQueryStarted(arg, { queryFulfilled }) {
    try {
      await queryFulfilled;
      MessagesService.commonMessage("Salary updated successfully");
    } catch (error) {
      console.error("Error updating salary:", error);
      MessagesService.commonMessage("Salary update failed");
    }
  },
}),
  }),
});

export const {
  

  //All Mutation

  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useGetSalaryDetailsMutation,
} = salaryApi;
