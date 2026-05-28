export interface CreateSignInRequestDto {
  eventId: string;
}

export interface SignInResponseDto {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  isOnWaitingList: string;
  waitingListPosition: string;
  isPayementValide: boolean;
}
