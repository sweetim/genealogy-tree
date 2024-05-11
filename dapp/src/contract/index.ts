import { getAptosClient } from "@/common/aptosClient"

export const MODULE_ADDRESS = "0xd61c0d45bb9379d6fa583bc659a3a36f1d8afc5b8418b2ee5a5ad93ee4a64a7e"

export type PersonMetadata = {
  index: number,
  id: string,
  name: string,
  gender: number,
  date_of_birth: string,
  date_of_death: string,
  image_uri: string,
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

export async function getAllPersonInCollection(collectionName: string): Promise<Person[]> {
  const [value] = await aptos.view<Person[][]>({
    payload: {
      function: `${MODULE_ADDRESS}::contract::get_all_person`,
    }
  })

  return value
}
