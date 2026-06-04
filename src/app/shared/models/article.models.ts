export interface ArticleImageResponseDto {
  id:string;
  url:string;
}

export interface ArticleResponseDto{
  id:string;
  title:string;
  content:string;
  author:string;
  viewCount:number;
  publicationDate:string;
  createdAt:Date;
  updatedAt?:Date;
  userId?:string;
  images: ArticleImageResponseDto[];
}

export interface CreateArticleRequestDto{
  title: string;
  content: string;
  author: string;
  imageUrls: string[];
}

export interface UpdateArticleRequestDto{
  title: string;
  content: string;
  author: string;
  imageUrls: string[];
}
