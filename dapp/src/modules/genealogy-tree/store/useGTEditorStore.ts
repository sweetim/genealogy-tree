import {
  create,
  StateCreator,
  StoreMutatorIdentifier,
} from "zustand"
import { immer } from "zustand/middleware/immer"

import {
  GenealogyTreeMetadata,
  Person,
  PersonMetadata,
} from "@/contract"
import {
  convertOnChainDataToEditorState,
  GenealogyTreeEditorState,
  getDefaultNodes,
} from "../model"

export type ImmerStateCreator<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
> = StateCreator<T, [...Mps, ["zustand/immer", never]], Mcs>

type GTEditorStateCreator = ImmerStateCreator<GTEditorStore>

type GTEditorSliceCreator<TSlice extends keyof GTEditorStore> = (
  ...params: Parameters<GTEditorStateCreator>
) => Pick<ReturnType<GTEditorStateCreator>, TSlice>

type GenealogyTreeOnChainDataState = {
  collectionMetadata: GenealogyTreeMetadata
  person: Person[]
}

type GenealogyTreeOnChainDataAction = {
  setCollectionMetadata: (data: GenealogyTreeMetadata) => void
  setAllPerson: (data: Person[]) => void
}

type GenealogyTreeOnChainDataSlice = GenealogyTreeOnChainDataState & GenealogyTreeOnChainDataAction

const genealogyTreeOnChainDataSlice: GTEditorSliceCreator<keyof GenealogyTreeOnChainDataSlice> = (set, get) => ({
  collectionMetadata: {
    id: "",
    description: "",
    name: "",
    uri: "",
  },
  person: [],
  setCollectionMetadata: (data) =>
    set((state) => {
      state.collectionMetadata = data
    }),
  setAllPerson: (data) =>
    set((state) => {
      state.person = data
    }),
})

type GenealogyTreeEditorAction = {
  updateFromOnChainData: () => void
  updateNode: (id: string, person: PersonMetadata) => void
  addNewNode: (id: string, source: string, target: string, mouse_x: number, mouse_y: number) => void
}

type GenealogyTreeEditorSlice = GenealogyTreeEditorState & GenealogyTreeEditorAction

const genealogyTreeEditorSlice: GTEditorSliceCreator<keyof GenealogyTreeEditorSlice> = (set, get) => ({
  nodes: getDefaultNodes(),
  edges: [],
  updateFromOnChainData: () =>
    set((state) => {
      const { edges, nodes } = convertOnChainDataToEditorState(state.person)

      if (nodes.length === 0 && edges.length === 0) {
        state.nodes = getDefaultNodes()
        state.edges = []

        return
      }

      state.nodes = nodes
      state.edges = edges
    }),
  addNewNode: (id: string, source: string, target: string, mouse_x: number, mouse_y: number) =>
    set((state) => {
      state.nodes.unshift({
        id,
        position: {
          x: mouse_x,
          y: mouse_y,
        },
        type: "personNode",
        data: {
          isNew: true,
          onChainData: {
            index: 0,
            id,
            name: "NEW",
            gender: 1,
            date_of_birth: "",
            date_of_death: "",
            image_uri: "",
          },
        },
      })

      state.edges.push({
        id: `e${source}-${target}`,
        source,
        target,
        type: "smoothstep",
      })
    }),
  updateNode: (id: string, person: PersonMetadata) =>
    set((state) => {
      const index = state.nodes.findIndex(n => n.id === id)
      if (index !== -1) {
        state.nodes[index].data.isNew = false
        state.nodes[index].data.onChainData = person
        console.log(person)
      }
    }),
})

type GTEditorStore = GenealogyTreeOnChainDataSlice & GenealogyTreeEditorSlice

const useGTEditorStore = create<GTEditorStore>()(
  immer((...args) => ({
    ...genealogyTreeOnChainDataSlice(...args),
    ...genealogyTreeEditorSlice(...args),
  })),
)

export default useGTEditorStore
