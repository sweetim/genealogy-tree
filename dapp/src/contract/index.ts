import { getAptosClient } from "@/common/aptosClient"
import { v4 as uuidv4 } from "uuid";

export const MODULE_ADDRESS = "0x14cfffb3e4a3d95d4bc20ffc667ad9dd6560fc56539457014bae9d5900815e72"

export enum PersonGender {
  Male = 1,
  Female
}

export type PersonMetadata = {
  index: number,
  id: string,
  name: string,
  gender: number,
  date_of_birth: string,
  date_of_death: string,
  image_uri: string,
}

export function getDefaultPersonMetadata(): PersonMetadata {
  return {
    index: 0,
    id: uuidv4(),
    name: "",
    gender: 0,
    date_of_birth: new Date(Date.now()).toDateString(),
    date_of_death: "",
    image_uri: "",
  }
}

export type PersonRelationship = {
  parent_ids: string[],
  children_ids: string[]
}

export type Person = {
  metadata: PersonMetadata,
  relationship: PersonRelationship
}

export type GenealogyTreeMetadata = {
  id: string,
  name: string,
  uri: string,
  description: string
}

const aptos = getAptosClient()

export async function getAllCollection(): Promise<GenealogyTreeMetadata[]> {
  const [value] = await aptos.view<GenealogyTreeMetadata[][]>({
    payload: {
      function: `${MODULE_ADDRESS}::contract::get_all_collection`,
    }
  })

  return value
}

export async function getCollectionById(collectionId: string): Promise<GenealogyTreeMetadata> {
  const [value] = await aptos.view<GenealogyTreeMetadata[]>({
    payload: {
      function: `${MODULE_ADDRESS}::contract::get_collection_by_id`,
      functionArguments: [
        collectionId
      ]
    }
  })

  return value
}

export async function getAllPersonInCollection(collectionId: string): Promise<Person[]> {
  const [value] = await aptos.view<Person[][]>({
    payload: {
      function: `${MODULE_ADDRESS}::contract::get_all_person`,
      functionArguments: [
        collectionId
      ]
    }
  })

  return value
}

