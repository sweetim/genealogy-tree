import { Edge, Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { Person, PersonMetadata } from "@/contract";

export type EditorNodeProps<T> = {
  isNew: boolean,
  onChainData: T
}

export type GenealogyTreeEditorState = {
  nodes: Node<EditorNodeProps<PersonMetadata>>[],
  edges: Edge[]
}

export function getDefaultNodes(): Node<EditorNodeProps<PersonMetadata>>[] {
  const id = uuidv4()

  return [
    {
      id,
      position: {
        x: 0,
        y: 0
      },
      data: {
        isNew: false,
        onChainData: {
          index: 0,
          id,
          name: "you",
          gender: 1,
          date_of_birth: "",
          date_of_death: "",
          image_uri: "https://robohash.org/a?set=set1",
        }
      },
      type: "personNode"
    }
  ]
}

// edge definition - parents at the top of user and children is below
// edge id should be defined from to where
// for parent edge id = e-[parent_id]-[user_id]
// for child edge id = e-[user_id]-[child_id]
export function convertOnChainDataToEditorState(person: Person[]): GenealogyTreeEditorState {
  const nodes = person.map(p => ({
    id: p.metadata.id,
    type: "personNode",
    position: {
      x: 0,
      y: 0
    },
    data: {
      isNew: false,
      onChainData: p.metadata
    }
  }))

  const edges = person.flatMap(p => {
    const parentEdges = p.relationship.parent_ids.map(pid => ({
      id: `e-(${pid})-(${p.metadata.id})`,
      source: pid,
      target: p.metadata.id,
      type: "smoothstep"
    }))

    const childEdges = p.relationship.children_ids.map(cid => ({
      id: `e-(${p.metadata.id})-(${cid})`,
      source: p.metadata.id,
      target: cid,
      type: "smoothstep"
    }))

    return [...parentEdges, ...childEdges]
  })

  const uniqueEdges = [...new Map(edges.map(e => [e.id, e])).values()]

  return {
    nodes,
    edges: uniqueEdges
  }
}

export function convertEditorStateToOnChainData(state: GenealogyTreeEditorState): Person[] {
  const { nodes, edges } = state

  return nodes.map(n => ({
    metadata: n.data.onChainData,
    relationship: {
      parent_ids: edges.filter(e => e.target === n.id).map(e => e.source),
      children_ids: edges.filter(e => e.source === n.id).map(e => e.target)
    }
  }))
}

export type BatchUpsertPersonMetadataArgs = {
  id: string[],
  name: string[],
  gender: number[],
  date_of_birth: string[],
  date_of_death: string[],
  image_uri: string[],
  parent_ids: string[][],
  children_ids: string[][],
}

export function convertOnChainDataToBatchUpsertPersonArgs(person: Person[]): BatchUpsertPersonMetadataArgs {
  return {
    id: person.map(p => p.metadata.id),
    name: person.map(p => p.metadata.name),
    gender: person.map(p => p.metadata.gender),
    date_of_birth: person.map(p => p.metadata.date_of_birth),
    date_of_death: person.map(p => p.metadata.date_of_death),
    image_uri: person.map(p => p.metadata.image_uri),
    parent_ids: person.map(p => p.relationship.parent_ids),
    children_ids: person.map(p => p.relationship.children_ids),
  }
}
