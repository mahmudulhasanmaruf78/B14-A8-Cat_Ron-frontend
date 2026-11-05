import { Book, CreateBookInput, UpdateBookInput } from '@/types/book';
import { BorrowRecord } from '@/types/borrow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CreateBookResponse {
  success: boolean;
  message: string;
  insertedId?: string;
  data?: Book;
  error?: string;
}

export interface UpdateBookResponse {
  success: boolean;
  message: string;
  data?: Book;
  error?: string;
}

export interface DeleteBookResponse {
  success: boolean;
  message: string;
  data?: {
    deletedId: string;
  };
  error?: string;
}

export interface SingleBookResponse {
  success: boolean;
  message: string;
  data?: Book;
  error?: string;
}

export interface BorrowBookInput {
  bookId: string;
  borrowDate: string;
  returnDate: string;
}

export interface BorrowBookResponse {
  success: boolean;
  message: string;
  data?: BorrowRecord;
  error?: string;
}

export interface GetUserBorrowsResponse {
  success: boolean;
  message: string;
  data: BorrowRecord[];
  error?: string;
}

export interface ReturnBookResponse {
  success: boolean;
  message: string;
  data?: {
    borrowId: string;
    bookId: string;
    returnedTitle: string;
  };
  error?: string;
}

export interface GetAllBooksResponse {
  success: boolean;
  message: string;
  data: Book[];
  error?: string;
}

export interface UploadImageResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export class BooksService {
  public static async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to upload image. Please try again.',
      };
    }

    return {
      success: true,
      url: data.url,
    };
  }

  public static async createBook(input: CreateBookInput): Promise<CreateBookResponse> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to add book to the collection.',
      };
    }

    return data;
  }

  public static async getAllBooks(limit?: number): Promise<GetAllBooksResponse> {
    const url = limit && limit > 0
      ? `${API_BASE_URL}/books?limit=${limit}`
      : `${API_BASE_URL}/books`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure data is freshly fetched in client or request-time
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch books from the library.',
        data: [],
      };
    }

    return {
      success: true,
      message: data.message || 'Books retrieved successfully',
      data: Array.isArray(data.data) ? data.data : [],
    };
  }

  public static async updateBook(id: string, input: UpdateBookInput): Promise<UpdateBookResponse> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update book.',
      };
    }

    return data;
  }

  public static async deleteBook(id: string): Promise<DeleteBookResponse> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete book.',
      };
    }

    return data;
  }

  public static async getBookById(id: string): Promise<SingleBookResponse> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to retrieve book details.',
      };
    }

    return data;
  }

  public static async borrowBook(input: BorrowBookInput): Promise<BorrowBookResponse> {
    const response = await fetch('/api/borrows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to borrow book.',
      };
    }

    return data;
  }

  public static async getUserBorrows(): Promise<GetUserBorrowsResponse> {
    const response = await fetch('/api/borrows', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch borrowed books.',
        data: [],
      };
    }

    return {
      success: true,
      message: data.message || 'Borrow records retrieved successfully',
      data: Array.isArray(data.data) ? data.data : [],
    };
  }

  public static async returnBook(borrowId: string): Promise<ReturnBookResponse> {
    const response = await fetch(`/api/borrows/${borrowId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to return book.',
      };
    }

    return data;
  }
}
