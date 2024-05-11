import { getAptosClient } from "@/common/aptosClient"

export const MODULE_ADDRESS = "0xe67aa0314cb7fe09a36b8496d981f96d12f49cccc046cdb8e8a57ba7b640b503"

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

