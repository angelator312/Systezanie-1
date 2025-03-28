import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import type { SettingsInterface, User, UserData } from "./User";
import { getDefaultSettings, getDefaultUser, getDefaultUserData } from "./User";
import { getDefaultVariable } from "./VariableThings";
import { replaceNulls } from "./MongoUtils";
export class UserStore {
  FixDatabase() {
    const defaultUser = getDefaultUser();
    //@ts-ignore
    replaceNulls(defaultUser, this.collection, {}, []);
  }
  collection!: Collection<User>;
  constructor(protected readonly collectionName: string) {}
  protected hash(s: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(s, salt);
    return hash;
  }
  async conect(urlforconnect: string) {
    const client = new MongoClient(urlforconnect);
    // Свързваме се със Mongo Сървъра
    await client.connect();

    // Взимаме си базата с която ще работим
    const database = client.db();
    // Взимаме си колекцията с която ще работим
    this.collection = database.collection(this.collectionName);
    // console.log(this.collectionName, this.collection);
  }
  async addUser(user: string, pass: string): Promise<User> {
    const passH = this.hash(pass);
    const v: User = {
      ...getDefaultUser(),
      user,
      passH,
    };
    const i = await this.collection.replaceOne({ user: user }, v, {
      upsert: true,
    });
    v._id = i.upsertedId;
    return v;
  }
  async getUser(user: string): Promise<User | null> {
    const data = await this.collection.findOne({ user: user }).catch(() => {
      return null;
    });
    if (!data) {
      return null;
    }
    return data;
  }
  async checkUser(user: string, pass: string): Promise<User | null> {
    const data = await this.getUser(user);
    if (data) {
      if (await bcrypt.compare(pass, data.passH)) return data;
    }
    return null;
  }
  async changePassword(user: string, newPass: string): Promise<boolean> {
    const passH = this.hash(newPass);
    const data = await this.getUser(user);
    if (!data) return false;
    const v: User = {
      ...data,
      passH,
    };
    const i = await this.collection.replaceOne({ user: user }, v, {
      upsert: true,
    });
    v._id = i.upsertedId;
    return true;
  }

  //Settings
  getDefaultSettings(): SettingsInterface {
    return getDefaultSettings();
  }
  async getMySettings(user: string): Promise<SettingsInterface> {
    const data = await this.collection.findOne({ user: user });
    if (data) {
      if (data.settings) {
        return data.settings;
      }
    }
    return this.getDefaultSettings();
  }
  async adjustSettings(
    settings: SettingsInterface,
    user: string
  ): Promise<SettingsInterface> {
    const data = await this.getUser(user);
    if (!data) return settings;

    let v: User = {
      ...data,
      settings,
    };
    await this.collection.replaceOne({ user }, v);
    return settings;
  }
  async adjustUserData(settings: UserData, user: string): Promise<UserData> {
    const data = await this.getUser(user);
    if (!data) return settings;

    let v: User = {
      ...data,
      data: settings,
    };
    await this.collection.replaceOne({ user }, v);
    return settings;
  }

  //User data
  getDefaultUserData(): UserData {
    return getDefaultUserData();
  }
  async isAdmin(a: string): Promise<boolean> {
    const data = await this.getUser(a);
    if (data) {
      if (data?.admin == true) {
        return true;
      }
    }
    return false;
  }
  async getUserDatas(names: string[]) {
    const arr = [];
    for (const e of names) {
      arr.push((await this.collection.findOne({ user: e }))?.data);
    }
    return arr;
  }
  //Variables
  async editVariable(user: string, id: string, plusR: number) {
    const data = await this.getUser(user);
    if (!data) return null;

    let v: User = {
      ...data,
    };
    if (v.variables) {
      v.variables[id].value += plusR;
    } else {
      v.variables = {};
      v.variables[id] = getDefaultVariable();
      // console.log(v.variables);

      v.variables[id].value += plusR;
    }
    const i = await this.collection.replaceOne({ user }, v);
    v._id = i.upsertedId;
    // console.log("vars updated:", v);

    return v;
  }
}
let ObUser: { [key: string]: UserStore } = {};

export default async function getUserStore(
  url: string | undefined = process.env.MONGO_URL,
  collectionName: string = "Register"
) {
  if (!ObUser[collectionName]) {
    ObUser[collectionName] = new UserStore(collectionName);
    await ObUser[collectionName].conect(
      url ?? "mongodb://book:book@127.0.0.1/Systezanie1-2023-24"
    );
  }
  return ObUser[collectionName];
}
