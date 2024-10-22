export default class User {
  name: string;
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}