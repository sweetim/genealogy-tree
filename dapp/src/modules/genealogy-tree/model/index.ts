export enum PersonGender {
  Male = 1,
  Female
}

export type PersonMetadata = {
  name?: string,
  age?: number,
  dateOfBirth?: string,
  dateOfDeath?: string,
  gender?: PersonGender,
  imageUri?: string,
}

export * from "./editor"
