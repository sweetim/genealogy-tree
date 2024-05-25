import {
  EphemeralKeyPair,
  KeylessAccount,
} from "@aptos-labs/ts-sdk"
import { create } from "zustand"
import {
  createJSONStorage,
  persist,
} from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type EphemeralKeyPairStorage = {
  [nonce: string]: EphemeralKeyPair
}

type EphemeralKeyPairState = {
  keylessAccount: KeylessAccount | null
  ephemeralKeyPair: EphemeralKeyPair | null
  ephemeralKeyPairStorage: EphemeralKeyPairStorage
}

type EphemeralKeyPairActions = {
  setEphemeralKeyPair: (input: EphemeralKeyPair) => void
  removeEphemeralKeyPair: (nonce: string) => void
  setKeylessAccount: (input: KeylessAccount) => void
  removeKeylessAccount: () => void
}

const EphemeralKeyPairEncoding = {
  decode: (e: any) => EphemeralKeyPair.fromBytes(e.data),
  encode: (e: EphemeralKeyPair) => ({ __type: "EphemeralKeyPair", data: e.bcsToBytes() }),
}

export const useEphemeralKeyPairStore = create<EphemeralKeyPairState & EphemeralKeyPairActions>()(
  immer(
    persist(
      (set, get) => ({
        keylessAccount: null,
        ephemeralKeyPair: null,
        ephemeralKeyPairStorage: {},
        setEphemeralKeyPair: (input: EphemeralKeyPair) =>
          set((state) => {
            state.ephemeralKeyPair = input
            state.ephemeralKeyPairStorage[input.nonce] = input
          }),
        removeEphemeralKeyPair: (nonce: string) =>
          set((state) => {
            delete state.ephemeralKeyPairStorage[nonce]
          }),
        setKeylessAccount: (input: KeylessAccount) =>
          set((state) => {
            state.keylessAccount = input
          }),
        removeKeylessAccount: () =>
          set((state) => {
            state.keylessAccount = null
          }),
      }),
      {
        name: "ephemeral-key-pair-store",
        partialize: (state) => ({
          ephemeralKeyPairStorage: state.ephemeralKeyPairStorage,
        }),
        onRehydrateStorage: (state) => {
          return (state, error) => {
            if (error) {
              console.log("an error happened during hydration", error)
            }
          }
        },
        storage: createJSONStorage(() => localStorage, {
          reviver: (key, value) =>
            JSON.parse(value as string, (_, e) => {
              if (e && e.__type === "bigint") return BigInt(e.value)
              if (e && e.__type === "Uint8Array") return new Uint8Array(e.value)
              if (e && e.__type === "EphemeralKeyPair") {
                return EphemeralKeyPairEncoding.decode(e)
              }
              return e
            }),
          replacer: (key, value) =>
            JSON.stringify(value, (_, e) => {
              if (typeof e === "bigint") return { __type: "bigint", value: e.toString() }
              if (e instanceof Uint8Array) {
                return { __type: "Uint8Array", value: Array.from(e) }
              }
              if (e instanceof EphemeralKeyPair) {
                return EphemeralKeyPairEncoding.encode(e)
              }
              return e
            }),
        }),
      },
    ),
  ),
)
