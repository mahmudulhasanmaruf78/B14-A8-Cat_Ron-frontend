import { Book, CreateBookInput } from '@/types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CreateBookResponse {
  success: boolean;
  message: string;
  insertedId?: string;
  data?: Book;
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

  public static async getAllBooks(): Promise<GetAllBooksResponse> {
    const response = await fetch(`${API_BASE_URL}/books`, {
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
}
