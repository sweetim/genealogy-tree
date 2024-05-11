// sum.test.js
import { expect, test } from 'vitest'
import { BatchUpsertPersonMetadataArgs, GenealogyTreeEditorState, convertEditorStateToOnChainData, convertOnChainDataToBatchUpsertPersonArgs, convertOnChainDataToEditorState } from './editor'
import { Person } from '@/contract'

const onChainData: Person[] = [
  {
    metadata: {
      index: 0,
      id: "0",
      name: "a",
      gender: 1,
      date_of_birth: "1921-01-01",
      date_of_death: "",
      image_uri: "https://robohash.org/a?set=set1",
    },
    relationship: {
      parent_ids: [],
      children_ids: ["1"]
    }
  },
  {
    metadata: {
      index: 1,
      id: "1",
      name: "b",
      gender: 2,
      date_of_birth: "1921-01-01",
      date_of_death: "",
      image_uri: "https://robohash.org/b?set=set1",
    },
    relationship: {
      parent_ids: ["0"],
      children_ids: ["2"]
    }
  },
  {
    metadata: {
      index: 2,
      id: "2",
      name: "c",
      gender: 2,
      date_of_birth: "1921-01-01",
      date_of_death: "",
      image_uri: "https://robohash.org/c?set=set1",
    },
    relationship: {
      parent_ids: ["1"],
      children_ids: []
    }
  },
]

const gtEditorState: GenealogyTreeEditorState = {
  nodes: [
    {
      id: "0",
      position: {
        x: 0,
        y: 0
      },
      data: {
        isNew: false,
        onChainData: {
          index: 0,
          id: "0",
          name: "a",
          gender: 1,
          date_of_birth: "1921-01-01",
          date_of_death: "",
          image_uri: "https://robohash.org/a?set=set1",
        }
      },
      type: "personNode"
    },
    {
      id: "1",
      position: {
        x: 0,
        y: 0
      },
      data: {
        isNew: false,
        onChainData: {
          index: 1,
          id: "1",
          name: "b",
          gender: 2,
          date_of_birth: "1921-01-01",
          date_of_death: "",
          image_uri: "https://robohash.org/b?set=set1",
        }
      },
      type: "personNode"
    },
    {
      id: "2",
      position: {
        x: 0,
        y: 0
      },
      data: {
        isNew: false,
        onChainData: {
          index: 2,
          id: "2",
          name: "c",
          gender: 2,
          date_of_birth: "1921-01-01",
          date_of_death: "",
          image_uri: "https://robohash.org/c?set=set1",
        }
      },
      type: "personNode"
    },
  ],
  edges: [
    {
      id: "e-(0)-(1)",
      source: "0",
      target: "1",
      type: "smoothstep"
    },
    {
      id: "e-(1)-(2)",
      source: "1",
      target: "2",
      type: "smoothstep"
    },
  ]
}

test("convertOnChainDataToEditorData", () => {
  const actual = convertOnChainDataToEditorState(onChainData)
  expect(actual).toStrictEqual(gtEditorState)
})

test("convertOnChainDataToEditorData", () => {
  const actual = convertEditorStateToOnChainData(gtEditorState)
  expect(actual).toStrictEqual(onChainData)
})

test("convertOnChainDataToBatchUpsertPersonArgs", () => {
  const actual = convertOnChainDataToBatchUpsertPersonArgs(onChainData)

  const expected: BatchUpsertPersonMetadataArgs = {
    id: [
      "0", "1", "2"
    ],
    name: [
      "a", "b", "c"
    ],
    gender: [
      1, 2, 2
    ],
    date_of_birth: [
      "1921-01-01",
      "1921-01-01",
      "1921-01-01"
    ],
    date_of_death: [
      "", "", ""
    ],
    image_uri: [
      "https://robohash.org/a?set=set1",
      "https://robohash.org/b?set=set1",
      "https://robohash.org/c?set=set1"
    ],
    parent_ids: [
      [],
      ["0"],
      ["1"]
    ],
    children_ids: [
      ["1"],
      ["2"],
      []
    ],
  }

  expect(actual).toStrictEqual(expected)
})
