import Beautiful_DnD from "./Beautiful_DnD";

export type TCard = {
  id: string,
  name: string,
  link: string
};

export type TBucket = {
  id: string,
  name: string,
  cards: TCard[]
};

export default Beautiful_DnD;