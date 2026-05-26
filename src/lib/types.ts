export interface UserProfile {
  name: string
  birthYear: string
  status: string
  occupation: string
  goal: string
}

export interface QuizAnswers {
  profile: UserProfile
  ikigai9: (number | null)[]
  love: string[]
  strength: string[]
  mission: string[]
  income: string[]
}

export interface Career {
  title: string
  reason: string
  fitScore: number
  growth: string
}

export interface PillarDetail {
  themes: string[]
  insight: string
}

export interface IkigaiResult {
  userName: string
  statement: string

  ikigai9Score: number
  ikigai9Level: string
  ikigai9Analysis: string

  love: PillarDetail
  strength: PillarDetail
  mission: PillarDetail
  income: PillarDetail

  intersections: {
    passion: string
    profession: string
    vocation: string
    calling: string
  }

  coreValues: string[]
  personalitySnapshot: string
  uniqueStrengths: string
  blindSpots: string[]

  careers: Career[]

  actionPlan: {
    shortTerm: string[]
    midTerm: string[]
    longTerm: string[]
  }

  letter: string
}
