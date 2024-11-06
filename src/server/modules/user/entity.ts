import { Storage } from "microgen-v3-sdk";

export interface User {
  _id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  role: string[];
  avatar?: Storage[];
}

export interface RegolSession {
  _createdAt: string;
  _updatedAt: string;
  device: string;
  deviceId: string;
  email: string;
  id: string;
  loginAt: string;
  status: string;
}
