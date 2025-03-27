import { MessagesService } from "../../lib/MessagesService";
import { api } from ".";

// 1. Define the payload interface for the POST body:
export interface CreateCompanyPayload {
  user_id: string;
  auth_key: string;
  city: string;
  company_address: string;
  district: string;
  email: string;
  gst: string;
  image: string;
  name: string;
  phone: string;
  state: string;
  website: string;
  zipcode: string;
}

// 2. (Optional) Define the response structure you expect back from the API:
export interface CreateCompanyResponse {
  success: boolean;           // or any boolean the API might return
  message?: string;           // if your API includes a message
  data?: Record<string, any>; // if the API returns data about the created company
}

// 3. Inject endpoints into your base API:
export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new company
    createCompany: builder.mutation<CreateCompanyResponse, CreateCompanyPayload>({
      query: (payload) => ({
        url: "hrm/companies/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Company"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Company created successfully");
        } catch (error) {
          console.error("Error creating company:", error);
          MessagesService.commonMessage("Company creation failed");
        }
      },
    }),

    // Get a list of companies
    getCompanyList: builder.mutation<any, Partial<any>>({
      query: (employee) => ({
        url: `hrm/companies/list`,
        method: "POST",
        body: employee,
      }),
      invalidatesTags: ["Company"],
    }),

    // Delete a company by ID
    deleteCompany: builder.mutation<
      { success: boolean; company?: any },
      { id: number; payload?: Partial<any> }
    >({
      query: ({ id, payload }) => ({
        url: `hrm/companies/delete/${id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Company"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Company deleted successfully", "SUCCESS");
        } catch (error) {
          console.error("Error deleting Company:", error);
          MessagesService.commonMessage("Company deletion failed");
        }
      },
    }),
  }),
});

// 4. Export the auto-generated hooks:
export const {
  useCreateCompanyMutation,
  useGetCompanyListMutation,
  useDeleteCompanyMutation,
} = companyApi;