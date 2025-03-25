import { MessagesService } from "../../lib/MessagesService";
import { api } from ".";

// New interface to represent an Account
export interface Account {
  id: number;
  name: string;
  email: string;
}

// Type for updating account payload
export interface UpdateAccountInput {
  auth_key: string;
  employee_id: number; // or account id if required by API
  name?: string;
  email?: string;
  // add other account fields as required
}

// NEW: Interface representing bank account payload based on provided data input
export interface BankAccountPayload {
  user_id: string;
  auth_key: string;
  employee_id: number;
  account_type: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  status: string;
  company_id: number;
}

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new account
    createAccount: builder.mutation<Account, Partial<Account>>({
      query: (account) => ({
        url: "hrm/account-info/create",
        method: "POST",
        body: account,
      }),
      invalidatesTags: ["Account"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Account created successfully");
        } catch (error) {
          console.error("Error creating account:", error);
          MessagesService.commonMessage("Account creation failed");
        }
      },
    }),

    // Get account details
    getAccountDetails: builder.mutation<Account, Partial<Account>>({
      query: (account) => ({
        url: `hrm/account-info/get-details`,
        method: "POST",
        body: account,
      }),
      invalidatesTags: ["Account"],
    }),

    // Update account information
    updateAccount: builder.mutation<
      { success: boolean; account?: Account },
      UpdateAccountInput
    >({
      query: (payload) => ({
        url: `hrm/account-info/update`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Account"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          MessagesService.commonMessage("Account updated successfully");
        } catch (error) {
          console.error("Error updating account:", error);
          MessagesService.commonMessage("Account update failed");
        }
      },
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useGetAccountDetailsMutation,
} = accountApi;