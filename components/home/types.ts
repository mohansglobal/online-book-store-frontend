import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

export type Book = {
  title: string;
  author: string;
  cover: string | StaticImageData;
  price: string;
  priceIn?: string;
  originalPrice?: string;
  rating: string;
  category: string;
  detail?: string;
};

export type Author = {
  name: string;
  genre: string;
  works?: string;
  bio?: string;
  image: string;
};

export type Category = {
  name: string;
  image?: string | StaticImageData;
  count?: number;
};

export type ButtonProps = {
  children: ReactNode;
  secondary?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

export type IconButtonProps = {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  count?: number;
  className?: string;
};

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: string;
};

export type BookCardProps = {
  book: Book;
  compact?: boolean;
  size?: "sm" | "md";
  className?: string;
  onWish: () => void;
  onCart: () => void;
};

export type BookCarouselProps = {
  title: string;
  eyebrow?: string;
  items: Book[];
  onWish: () => void;
  onCart: () => void;
  className?: string;
  id?: string;
};
