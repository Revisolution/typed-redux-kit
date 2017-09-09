export interface MappedReducerOptions<S> {
  initialState?: S
}
export type Reducer<STATE, ACTION> = (state: STATE, action: ACTION) => STATE
