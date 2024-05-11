import { GenealogyTreeMetadata, Person, PersonMetadata } from "@/contract";
import { Edge, Node } from "reactflow";
import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

type GenealogyTreeOnChainDataState = {
  collectionMetadata: GenealogyTreeMetadata,
  person: Person[]
}

type GenealogyTreeOnChainDataAction = {
  setCollectionMetadata: (data: GenealogyTreeMetadata) => void,
  setAllPerson: (data: Person[]) => void,
}

type GenealogyTreeOnChainDataSlice = GenealogyTreeOnChainDataState & GenealogyTreeOnChainDataAction

const genealogyTreeOnChainDataSlice: ImmerStateCreator<GenealogyTreeOnChainDataSlice> = (set, get) => ({
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

type GenealogyTreeEditorState = {
  nodes: Node<PersonMetadata>[],
  edges: Edge[],
}

type GenealogyTreeEditorAction = {

}

type GenealogyTreeEditorSlice = GenealogyTreeEditorState & GenealogyTreeEditorAction

const genealogyTreeEditorSlice: ImmerStateCreator<GenealogyTreeEditorSlice> = (set) => ({
  nodes: [],
  edges: [],
})

type GTEditorStore = GenealogyTreeOnChainDataSlice & GenealogyTreeEditorState

const useGTEditorStore = create<GTEditorStore>()(
  immer((...args) => ({
    ...genealogyTreeOnChainDataSlice(...args),
    ...genealogyTreeEditorSlice(...args)
  }))
)

export default useGTEditorStore
