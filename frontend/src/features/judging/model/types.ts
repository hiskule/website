export interface Judge {
  id: number
  name: string
}

export interface Team {
  id: number
  team_number: number
  room: string
}

export interface Scores {
  category1: number | null
  category2: number | null
  category3: number | null
  category4: number | null
  category5: number | null
}

export const EMPTY_SCORES: Scores = {
  category1: null,
  category2: null,
  category3: null,
  category4: null,
  category5: null,
}
