import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";
export interface TextOrBs {
  _id?: string;
  id?: string;
  isBook?: boolean;
  text: string;
  text2?: string;
  tags?: string[];
  public?: boolean;
  avtor?: string;
}

export class BookStore {
  async addBook(book: string | null, b: string, avtor: string, publ = true) {
    const v: TextOrBs = {
      id: `Book-${book}--1`,
      isBook: true,
      text: b,
      public: publ,
      avtor,
    };
    await this.collection.replaceOne({ id: `Book-${book}--1` }, v, {
      upsert: true,
    });
    return v;
  }
  async getBook(book: string ) {
    const t = await this.collection.findOne({
      text: book,
      isBook: true,
    });
    return t;
  }
  async getPublicBooks() {
    const data = await this.collection
      .find({ public: true,isBook:true }, { sort: { time: "ascending" } })
      .toArray();
    if (data.length === 0) {
      return null;
    }
    return data;
  }
  async getMyBooks(avt:string) {
    const data = await this.collection
      .find({public:false,isBook:true,avtor:avt }, { sort: { time: "ascending" } })
      .toArray();
    if (data.length === 0) {
      return null;
    }
    return data;
  }
  collection!: Collection<TextOrBs>;
  // eslint-disable-next-line no-useless-constructor
  constructor(protected readonly collectionName: string) {}
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
  async addText(id: string, text: string, text2: string): Promise<TextOrBs> {
    const v: TextOrBs = {
      id: id,
      text,
      text2,
    };
    await this.collection.replaceOne({ id: id }, v, { upsert: true });

    return v;
  }
  async getText(id: string): Promise<TextOrBs | null> {
    const data = await this.collection.findOne({ id: id });
    if (!data) {
      return null;
    }
    return data;
  }
}
let ObTexts: { [key: string]: BookStore } = {};
export default async function getTextStore(
  url: string | undefined = process.env.MONGO_URL,
  collectionName: string = "Books"
) {
  if (!ObTexts[collectionName]) {
    ObTexts[collectionName] = new BookStore(collectionName);
    await ObTexts[collectionName].conect(
      url ?? "mongodb://book:book@127.0.0.1/Systezanie1-2023-24"
    );
  }
  return ObTexts[collectionName];
}
