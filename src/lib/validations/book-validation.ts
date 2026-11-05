import { BOOK_CATEGORIES, BookCategory } from '@/types/book';

export interface BookFormValidationErrors {
  title?: string;
  author?: string;
  category?: string;
  image?: string;
  description?: string;
  totalCopies?: string;
}

export function validateBookForm(data: {
  title: string;
  author: string;
  category: string;
  imageFile: File | null;
  description: string;
  totalCopies: string | number;
}): { isValid: boolean; errors: BookFormValidationErrors } {
  const errors: BookFormValidationErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Book title is required';
  }

  if (!data.author.trim()) {
    errors.author = 'Author name is required';
  }

  if (!data.category || !BOOK_CATEGORIES.includes(data.category as BookCategory)) {
    errors.category = 'Please select a valid book category';
  }

  if (!data.imageFile) {
    errors.image = 'A book cover image is required';
  }

  if (!data.description.trim()) {
    errors.description = 'Short description is required';
  } else if (data.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  const copies = Number(data.totalCopies);
  if (
    data.totalCopies === '' ||
    data.totalCopies === undefined ||
    isNaN(copies) ||
    !Number.isInteger(copies) ||
    copies < 1
  ) {
    errors.totalCopies = 'Total copies must be a positive integer (minimum 1)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

