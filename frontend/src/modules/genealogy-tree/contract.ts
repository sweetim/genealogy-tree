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

export const MODULE_ADDRESS = "0x865dddd118a8e93c4852691fabe7c55f3db4bb67fbc354edeb2b401c7d6d3bc4"


// async function populatePersonClickHandler() {
//   if (!account) return;
//   console.log(account.address)

//   const index = 12
//   const transaction: InputTransactionData = {
//     data: {
//       function: `${MODULE_ADDRESS}::contract::register_person`,
//       functionArguments: Object.values(PERSON_INFO[index])
//     }
//   }

//   console.log(PERSON_INFO[index])
//   try {
//     const response: any = await signAndSubmitTransaction(transaction)
//     await aptos.waitForTransaction({ transactionHash: response.hash })
//   } catch (error) {
//     console.log(error)
//   }
// }

// async function updatePersonRelationClickHandler() {
//   const transaction: InputTransactionData = {
//     data: {
//       function: `${MODULE_ADDRESS}::contract::update_person_relation`,
//       functionArguments: [
//         [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//         [
//           [],
//           [0],
//           [0],
//           [0],
//           [0],
//           [0],
//           [2],
//           [2],
//           [3],
//           [3],
//           [4],
//           [4],
//           [4],
//         ],
//         [
//           [1, 2, 3, 4, 5],
//           [],
//           [6, 7],
//           [8, 9],
//           [10, 11, 12],
//           [],
//           [],
//           [],
//           [],
//           [],
//           [],
//           [],
//           []
//         ]
//       ]
//     }
//   }
//   try {
//     const response: any = await signAndSubmitTransaction(transaction)
//     await aptos.waitForTransaction({ transactionHash: response.hash })
//   } catch (error) {
//     console.log(error)
//   }
// }
