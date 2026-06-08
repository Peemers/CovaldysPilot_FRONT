export interface ReviewResponseDto {
  id: string;
  note: number;
  comment?: string;
  userId: string;
  userPseudo: string;
  eventId: string;
  createdAt: string;
}

export interface CreateReviewRequestDto {
  eventId: string;
  note: number;
  comment?: string;
}

export interface UpdateReviewRequestDto {
  note: number;
  comment?: string;
}
