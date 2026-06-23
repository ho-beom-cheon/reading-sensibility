export type Book = {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  coverUrl?: string;
  isbn?: string;
  createdAt: string;
  updatedAt: string;
};

export type BookSummary = Pick<Book, "id" | "title" | "author" | "publisher">;
