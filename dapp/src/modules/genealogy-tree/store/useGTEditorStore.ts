import { StateCreator, StoreMutatorIdentifier, create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { GenealogyTreeMetadata, Person, PersonMetadata } from "@/contract";
import { GenealogyTreeEditorState, convertOnChainDataToEditorState } from "../model";

export type ImmerStateCreator<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
> = StateCreator<T, [...Mps, ['zustand/immer', never]], Mcs>;

type GTEditorStateCreator = ImmerStateCreator<GTEditorStore>;

type GTEditorSliceCreator<TSlice extends keyof GTEditorStore> = (
  ...params: Parameters<GTEditorStateCreator>
) => Pick<ReturnType<GTEditorStateCreator>, TSlice>;

type GenealogyTreeOnChainDataState = {
  collectionMetadata: GenealogyTreeMetadata,
  person: Person[]
}

type GenealogyTreeOnChainDataAction = {
  setCollectionMetadata: (data: GenealogyTreeMetadata) => void,
  setAllPerson: (data: Person[]) => void,
}

type GenealogyTreeOnChainDataSlice = GenealogyTreeOnChainDataState & GenealogyTreeOnChainDataAction

const genealogyTreeOnChainDataSlice: GTEditorSliceCreator<keyof GenealogyTreeOnChainDataSlice> = (set, get) => ({
  collectionMetadata: {
    id: "",
    description: "",
    name: "",
    uri: ""
  },
  person: [],
  setCollectionMetadata: (data) =>
    set((state) => {
      state.collectionMetadata = data
    }),
  setAllPerson: (data) =>
    set((state) => {
      state.person = data
    })
})

type GenealogyTreeEditorAction = {
  updateFromOnChainData: () => void
}

type GenealogyTreeEditorSlice = GenealogyTreeEditorState & GenealogyTreeEditorAction

const genealogyTreeEditorSlice: GTEditorSliceCreator<keyof GenealogyTreeEditorSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  updateFromOnChainData: () =>
    set((state) => {
      const { edges, nodes } = convertOnChainDataToEditorState(state.person)

      state.nodes = nodes
      state.edges = edges
    })
})

type GTEditorStore = GenealogyTreeOnChainDataSlice & GenealogyTreeEditorSlice

const useGTEditorStore = create<GTEditorStore>()(
  immer((...args) => ({
    ...genealogyTreeOnChainDataSlice(...args),
    ...genealogyTreeEditorSlice(...args)
  }))
)

export default useGTEditorStore

