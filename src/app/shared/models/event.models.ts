export enum EventStatus {
  EnAttente = 'EnAttente',
  EnCours = 'EnCours',
  Termine = 'Termine',
  Annule = 'Annule',
}

export interface CreateCategoryResponseDto {
  Name: string;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  createAt: string;
}

export interface CreateEventRequestDto {
  name: string;
  description: string;
  price?: number;
  location?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  minParticipants: number;
  maxParticipants: number;
  isWaitingListActive: boolean;
  categoryIds: string[];
}

export interface UpdateEventRequestDto {
  name: string;
  description: string;
  price?: number;
  location?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  minParticipants: number;
  maxParticipants: number;
  isWaitingListActive: boolean;
  categoryIds: string[];
}

export interface EventResponseDto {
  id: string;
  categories: CategoryResponseDto[];
  name: string;
  description: string;
  location?: string;
  price?: number;
  coverImage?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  minParticipants: number;
  maxParticipants: number;
  isWaitingListActive: boolean;
  waitingListPosition?: number;
  currentParticipants: number;
  status: EventStatus;
  createdAt: string;
  updatedAt?: string;
  canRegister: boolean;
  isRegistered: boolean;
}

