export interface Candidate {
  name: string;
  clip_cover: string;
  clip_media: string;
}

export interface Category {
  name: string;
  candidates: Candidate[];
  id: string;
}
