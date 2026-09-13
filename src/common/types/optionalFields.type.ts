export type OptionalField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type ChangeTypeOfField<T, K extends keyof T, V> = {
    [P in keyof T]: P extends K ? V : T[P]
}
export type ChangeTypeOfFields<T, K extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof K> & {
    [R in keyof K]: K[R]
}

export type ChangeAndMakeOptionalField<T, K extends keyof T, V> = OptionalField<ChangeTypeOfField<T, K, V>, K>
export type ChangeAndMakeOptionalFields<T, K extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof K> & {
    [R in keyof K]?: K[R]
}