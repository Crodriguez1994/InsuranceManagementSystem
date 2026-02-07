export interface Client {
  id: number;
  identification: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  age: number;
  email?: string;
  status: boolean;
}
