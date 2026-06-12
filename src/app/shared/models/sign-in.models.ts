export interface CreateSignInRequestDto {
  eventId: string;
}

export interface SignInResponseDto {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  isOnWaitingList: boolean;
  waitingListPosition: number;
  isPaymentValid: boolean;
  userPseudo?: string;
  userFirstName?: string;
  userLastName?: string;
  eventName?: string;
  eventStatus?: string;
  eventStartDate?: string;
}
