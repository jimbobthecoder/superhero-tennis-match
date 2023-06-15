export interface Set {
    games: (Point[])[]
    tieBreak?: Point[]
}

export interface Point {
    wonBy: string
}