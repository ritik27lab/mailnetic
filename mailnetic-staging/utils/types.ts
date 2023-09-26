import { EmailProvider } from "../redux/slices/steps";

export interface UserConfig {
  email?: string;
  name?: string;
  jobTitle?: string;
  description?: string[];
  photoUrl?: string;
  company?: {
    name?: string;
    description?: string;
  };
  emailAccounts?: LinkedEmailAccount[];
}

export type LinkedEmailAccount = {
  type: EmailProvider;
  host?: string;
  port?: string;
  emailAddress: string;
  name?: string;
};
