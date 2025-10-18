export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export type MatchStatus = "correct" | "exists" | "unmatched";

export type GuessResponse = {
  type: "guess";
  color: string;
  completed: boolean;
  strikes: number;
  balls: number;
  attemptsLeft: number;
  postId: string;
  matches: ("correct" | "exists" | "unmatched")[];
}