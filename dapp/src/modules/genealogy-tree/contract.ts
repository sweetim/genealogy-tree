import { getAptosClient } from "../../common/aptosClient"

export type GenealogyTree = {
  childrens: string[],
  id: string,
  parents: string[],
  metadata: GenealogyTreePersonMetadata
}

export type GenealogyTreePersonMetadata = {
  name: string,
  age: number,
  date_of_birth: string,
  gender: number,
  date_of_death: string,
  image_uri: string,
  location: string,
}

export type PersonMetadataOnChain = {
  id: string,
  name: string,
  gender: number,
  date_of_birth: string,
  date_of_death: string,
  image_uri: string,
}

export type PersonRelationOnChain = {
  source: string,
  target: string
}

export const MODULE_ADDRESS = "0x9745f65c2d056411f4c29bd6f0b4596016b835667f18d2e2cf908d7969f6762a"

const aptos = getAptosClient()

export async function getAllPersonMetadata(): Promise<PersonMetadataOnChain[]> {
  const [value] = await aptos.view<PersonMetadataOnChain[][]>({
    payload: {
      function: `${MODULE_ADDRESS}::contract::get_all_person_metadata`,
    }
  })

  return value
}

export async function getAllPersonRelation(): Promise<PersonRelationOnChain[]> {
  const [value] = await aptos.view<PersonRelationOnChain[][]>({
    payload: {
      function: `${MODULE_ADDRESS}::contract::get_all_person_relation`,
    }
  })

  return value
}
