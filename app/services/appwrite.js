import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68aa512a003c550ef8ae");

const account = new Account(client);

export { client, account };