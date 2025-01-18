import type { ObjectId } from "mongodb";

export interface Turneta{
  _id?: ObjectId;
  time:string;//let now = new Date();
              //let todayString = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  duration?:number;
  timeForStop:string; //like time property
}

export interface User {
  _id?: ObjectId;
  glavi?: any;
  user: string;
  passH: string;
  settings?: SettingsInterface;
  data: UserData;
  admin: boolean;
}export interface UserData {
  forMe: string;
  isPro: boolean;
  verifiedAuthor: boolean;
}
export interface SettingsInterface {
  fontSize: number;
  tutorial?: boolean;
}

export function getDefaultSettings(): SettingsInterface {
  const settings: SettingsInterface = {
    fontSize: 10,
    tutorial: true,
  };
  return settings;
}

export function getDefaultUserData(): UserData {
  const settings: UserData = {
    forMe: "",
    verifiedAuthor: false,
    isPro: false,
  };
  return settings;
}
export function getDefaultUser(): User {
  const settings: User = {
    passH: "",
    user: "",
    data:getDefaultUserData(),
    admin: false,
  };
  return settings;
}