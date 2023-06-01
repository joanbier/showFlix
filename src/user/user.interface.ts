export interface UserData {
  username: string;
  email: string;
  token: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}
