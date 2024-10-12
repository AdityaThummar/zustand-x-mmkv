import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

export const configureStorage = (
  id: string = new Date().getTime().toString()
) => {
  const mmkv = new MMKV({ id });

  return {
    name: id,
    storage: createJSONStorage(() => ({
      getItem: (str: string) => mmkv.getString(str) ?? "",
      setItem: (key: string, val: string) => mmkv.set(key, val?.toString()),
      removeItem: (key: string) => mmkv.delete(key),
    })),
  } as unknown;
};

export const createPersistZustand = <T>(
  name: string,
  func: (set: (props: T) => void, get: () => T) => T
) =>
  create(
    persist<T>(
      (set: (props: T) => void, get: () => T) => func(set, get),
      configureStorage(name) as PersistOptions<T>
    )
  );
