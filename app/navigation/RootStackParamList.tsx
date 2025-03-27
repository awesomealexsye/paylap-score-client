import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabParamList } from "./BottomTabParamList";

export type RootStackParamList = {
  DrawerNavigation: NavigatorScreenParams<BottomTabParamList>;
  openDrawer: undefined;
  Demo: undefined;
  ChooseLanguage: undefined;
  QrCodeScanner: undefined;
  WelCome: undefined;
  SignUp: undefined;
  SingIn: undefined;
  MobileSignIn: undefined;
  OtpVerify: { mobile: string };
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPAuthentication: undefined;
  EmailVerify: undefined;
  NewPassword: undefined;
  Rewards: undefined;
  ResetPassword: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  TwoStepAuthentication: undefined;
  BottomNavigation: undefined;
  Singlechat: undefined;
  Chat: undefined;
  ShareApp: undefined;
  Support: undefined;
  History: undefined;
  Verification: undefined;
  Call: undefined;
  EditProfile: undefined;
  Trackorder: undefined;
  Products: undefined;
  Language: undefined;
  MyCart: undefined;
  Score: undefined;
  Category: undefined;
  Notifications: undefined;
  Questions: undefined;
  ProductsDetails: undefined;
  Writereview: undefined;
  Profile: undefined;
  Wishlist: undefined;
  UserKyc: undefined;
  FindUser: undefined;
  AddCustomer: undefined;
  UserReferralList: undefined;
  Report: undefined;
  CustomerTransations: { item: any };
  CustomerTransationsDetails: { customer: any };
  CustomerScore: { customer: any };
  EditUserPaymentDetail: undefined;
  NotAvailable: undefined;
  Search: undefined;
  Components: undefined;
  Coupons: undefined;
  DeliveryAddress: undefined;
  Checkout: undefined;
  Addcard: undefined;
  Payment: undefined;
  AddPayment: object | undefined;
  AddDeliveryAddress: undefined;
  Myorder: undefined;
  Notification: undefined;
  Home: undefined;
  Accordion: undefined;
  BottomSheet: undefined;
  ModalBox: undefined;
  Buttons: undefined;
  Badges: undefined;
  Charts: undefined;
  Headers: undefined;
  lists: undefined;
  Pricings: undefined;
  DividerElements: undefined;
  Snackbars: undefined;
  Socials: undefined;
  Swipeable: undefined;
  Tabs: undefined;
  Tables: undefined;
  Toggles: undefined;
  Inputs: undefined;
  Footers: undefined;
  TabStyle1: undefined;
  TabStyle2: undefined;
  TabStyle3: undefined;
  TabStyle4: undefined;
  CustomerSupport: undefined;
  TermsAndConditionsScreen: undefined;

  // ledgerbook
  LedgerMain: undefined;
  LedgerAddCustomer: undefined;
  LedgerCustomerDetails: { item: any };
  LedgerAddPayment: object | undefined;
  LedgerCustomerTransationsDetails: { customer: any };
  WithdrawalAmount: undefined;
  SelectLanguage: any;

  AddCompany: any;
  ListCompany: any;
  InvoiceGenList: any;
  AddInvoiceDetails: { data: any; items: any; parent_id: any };
  AddItems: { items: any; data: any };
  ChooseInvoiceDesign: { data: any } | undefined;

  FinalInvoiceResult: { data: { pdf_url: string }; previous_screen: string };
  AddCompanyCustomer: { data: { company_id: number }; items: any };
  CompanyCustomerList: any;
  SubInvoiceGenList: any;

  // INVOICE 2

  InvoiceLists: any;
  InvoiceCreate: any;
  InvoiceAddItems: any;
  InvoiceAddNewItems: any;
  InvoiceEditItem: any;
  InvoiceOrganizations: any;
  InvoiceAddOrganization: { orgranisationData: object } | undefined;
  InvoiceClients: any;
  InvoiceAddClient: any;
  InvoiceDetail: any;

  //HRM

  HrmHomeScreen: any;
  EmployeeManagementScreen: any;
  EmployeeListScreen: any;
  AddEmployee: any;
  EmployeeSuccessScreen: any;
  EmployeeDetailScreen: any;
  EmployeeAttendendsList: any;
  EmployeeAttendanceDetails: any;
  EditEmployee: any;

  ManageSalaryScreen: any;
  AccountInformationScreen: any;
  GenerateEmployeeSalariesListScreen: any;
  GenerateEmployeePdfListScreen: any;

  HRMAddCompany: any;
  HRMCompanyListScreen: any;
};
