export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  ssn?: string;
  driversLicense?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface WorkInfo {
  employer?: string;
  jobTitle?: string;
  industry?: string;
  yearsEmployed?: string;
  workPhone?: string;
  workEmail?: string;
  annualIncome?: string;
}

export interface FamilyInfo {
  relationshipStatus: string;
  spouseName?: string;
  numberOfKids?: number;
  kidsNames?: string[];
  kidsAges?: number[];
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface FinancialInfo {
  bankName?: string;
  accountType?: string;
  creditScore?: string;
  monthlyIncome?: string;
  monthlyExpenses?: string;
  assets?: string;
  debts?: string;
}

export interface Profile {
  id: string;
  name: string;
  personal: PersonalInfo;
  contact: ContactInfo;
  work: WorkInfo;
  family: FamilyInfo;
  financial: FinancialInfo;
  createdAt: string;
  updatedAt: string;
}
