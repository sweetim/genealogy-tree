import { Edge, Node } from "reactflow";
import { create } from "zustand";

import { PersonMetadata } from "../model";
import { immer } from "zustand/middleware/immer";

import { DATA } from "./data"

interface GenealogyTreeEditorStore {
  nodes: Node<PersonMetadata>[],
  edges: Edge[],
  addNewPerson: (id: string, source: string, target: string, mouse_x: number, mouse_y: number) => void,
  updatePerson: (id: string, person: PersonMetadata) => void,
  saveToChain: () => void
}

const useGenealogyTreeEditorStore = create<GenealogyTreeEditorStore>()(
  immer(
    (set, _get) => ({
      nodes: DATA.nodes,
      edges: DATA.edges,
      addNewPerson: (id: string, source: string, target: string, mouse_x: number, mouse_y: number) => set((state) => {
        state.nodes.unshift({
          id,
          position: {
            x: mouse_x,
            y: mouse_y
          },
          type: "personNode",
          data: {
            name: "NEW Person - Update HERE"
          }
        })

        state.edges.push({
          id: `e${source}-${target}`,
          source,
          target,
          type: 'smoothstep',
        })
      }),
      updatePerson: (id: string, person: PersonMetadata) => set((state) => {
        const index = state.nodes.findIndex(n => n.id === id)
        if (index !== -1) state.nodes[index].data = person
      }),
      saveToChain: () => set((_state) => {
        // let personMetadataOnChain = get().nodes.map<PersonMetadataOnChain>(n => ({
        //   id: n.id,
        //   name: n.data.name || "",
        //   gender: n.data.gender || 0,
        //   date_of_birth: n.data.dateOfBirth || "",
        //   date_of_death: n.data.dateOfDeath || "",
        //   image_uri: n.data.imageUri || "",
        // })).map(n => ({
        //   function: "0x8a9ed86121cbf83a25d1d3c90c15e2ffde05b2448b4fbee0dcc6e576a8528ce9::contract::create_person_metadata",
        //   functionArguments: Object.values(n),
        // }))
        // aptos.transaction.batch.forSingleAccount({ sender, data: payloads });

        // aptos.transaction.batch.on(TransactionWorkerEventsEnum.ExecutionFinish, async (data) => {
        //   // log event output
        //   console.log(data);

        //   // verify account sequence number
        //   const account = await aptos.getAccountInfo({ accountAddress: sender.accountAddress });
        //   console.log(`account sequence number is 101: ${account.sequence_number === "101"}`);

        //   // worker finished execution, we can now unsubscribe from event listeners
        //   aptos.transaction.batch.removeAllListeners();
        //   process.exit(0);
        // });
        // console.log(personMetadataOnChain)
      })
    })
  )
);

export default useGenealogyTreeEditorStore
