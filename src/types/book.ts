export const BOOK_CATEGORIES = ['Fiction', 'Science', 'History', 'Kids', 'Others'] as const;
export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface Book {
  _id?: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  userName: string;
  userEmail: string;
  totalCopies: number;
  createdAt?: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  userName: string;
  userEmail: string;
  totalCopies: number;
}

