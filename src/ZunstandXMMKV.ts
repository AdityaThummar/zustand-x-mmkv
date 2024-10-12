import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

export type CreatePersistZustandSetterType<T> = (props: T) => void;
export type CreatePersistZustandGetterType<T> = () => T;

export type CreatePersistZustandFunctionType<T> = (
  set: CreatePersistZustandSetterType<T>,
  get: CreatePersistZustandGetterType<T>
) => T;

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
  func: CreatePersistZustandFunctionType<T>
) =>
  create(
    persist<T>(
      (
        set: CreatePersistZustandSetterType<T>,
        get: CreatePersistZustandGetterType<T>
      ) => func(set, get),
      configureStorage(name) as PersistOptions<T>
    )
  ) as T;
