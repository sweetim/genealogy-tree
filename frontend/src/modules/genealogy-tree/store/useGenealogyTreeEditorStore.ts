import { Edge, Node } from "reactflow";
import { create } from "zustand";

import { PersonMetadata } from "../model";
import { immer } from "zustand/middleware/immer";

import { PersonMetadataOnChain, PersonRelationOnChain } from "../contract";

interface GenealogyTreeEditorStore {
  nodes: Node<PersonMetadata>[],
  nodesFromOnChain: Node<PersonMetadata>[],
  edges: Edge[],
  edgesFromOnChain: Edge[],
  addNewPerson: (id: string, source: string, target: string, mouse_x: number, mouse_y: number) => void,
  updatePerson: (id: string, person: PersonMetadata) => void,
  setDataFromOnChain: (person: PersonMetadataOnChain[], relation: PersonRelationOnChain[]) => void,
}

const useGenealogyTreeEditorStore = create<GenealogyTreeEditorStore>()(
  immer(
    (set, _get) => ({
      nodes: [],
      nodesFromOnChain: [],
      edges: [],
      edgesFromOnChain: [],
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
      setDataFromOnChain: (person: PersonMetadataOnChain[], relation: PersonRelationOnChain[]) => set((state) => {
        const nodes: Node<PersonMetadata>[] = person.map((p) => ({
          id: p.id,
          position: {
            x: 0,
            y: 0
          },
          data: {
            name: p.name,
            gender: p.gender,
            dateOfBirth: p.date_of_birth,
            dateOfDeath: p.date_of_death,
            imageUri: p.image_uri,
            age: 0
          },
          type: "personNode"
        }))

        const edges: Edge[] = relation.map(r => ({
          id: `e${r.source}-${r.target}`,
          source: r.source,
          target: r.target,
          type: "smoothstep"
        }))

        state.nodes = nodes
        state.nodesFromOnChain = nodes
        state.edges = edges
        state.edgesFromOnChain = edges
      }),
    })
  )
);

export default useGenealogyTreeEditorStore
