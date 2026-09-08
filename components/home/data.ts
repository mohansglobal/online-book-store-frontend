import smallThings from "@/assets/smallThings.jpeg";
import whiteTiger from "@/assets/whiteTiger.jpeg";
import fineBalance from "@/assets/fineBalance.jpeg";
import palaceIllusions from "@/assets/palaceIllusions.jpeg";
import midnightsChildren from "@/assets/midnightsChildren.jpeg";
import namesake from "@/assets/namesake.jpeg";
import trainPakistan from "@/assets/trainPakistan.jpeg";
import suitableBoy from "@/assets/suitableBoy.jpeg";

import novelsImg from "@/assets/novels.jpeg";
import poetryImg from "@/assets/poetry.jpeg";
import shortImg from "@/assets/short.jpeg";
import sport from "@/assets/sport.jpeg";
import spiritualityImg from "@/assets/sprit.jpeg";
import politicsImg from "@/assets/politics.jpeg";
import translationImg from "@/assets/translation.jpeg";
import eBooksImg from "@/assets/ebook.jpeg";
import textBooksImg from "@/assets/text-book.jpeg";

import type { Author, Book, Category } from "./types";

export const books: Book[] = [
  {
    title: "The God of Small Things",
    author: "Arundhati Roy",
    cover: smallThings,
    price: "₹399",
    rating: "4.8",
    category: "Literary Fiction",
    detail: "Booker Prize Winner",
  },
  {
    title: "The White Tiger",
    author: "Aravind Adiga",
    cover: whiteTiger,
    price: "₹349",
    rating: "4.7",
    category: "Contemporary India",
    detail: "Booker Prize Winner",
  },
  {
    title: "A Fine Balance",
    author: "Rohinton Mistry",
    cover: fineBalance,
    price: "₹499",
    rating: "4.9",
    category: "Historical Fiction",
    detail: "Set in 1970s India",
  },
  {
    title: "The Palace of Illusions",
    author: "Chitra Banerjee Divakaruni",
    cover: palaceIllusions,
    price: "₹375",
    rating: "4.6",
    category: "Indian Mythology",
    detail: "A Mahabharata Retelling",
  },
  {
    title: "Midnight's Children",
    author: "Salman Rushdie",
    cover: midnightsChildren,
    price: "₹449",
    rating: "4.8",
    category: "Magical Realism",
    detail: "Booker of Bookers",
  },
  {
    title: "The Namesake",
    author: "Jhumpa Lahiri",
    cover: namesake,
    price: "₹325",
    rating: "4.7",
    category: "Contemporary Fiction",
    detail: "Identity · Family · Diaspora",
  },
  {
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    cover: trainPakistan,
    price: "₹299",
    rating: "4.8",
    category: "Indian Classics",
    detail: "Stories of the 1947 Partition",
  },
  {
    title: "A Suitable Boy",
    author: "Vikram Seth",
    cover: suitableBoy,
    price: "₹599",
    rating: "4.9",
    category: "Indian Fiction",
    detail: "An Epic Family Saga",
  },
];

export const authors: Author[] = [
  {
    name: "Rabindranath Tagore",
    genre: "Poetry · Philosophy · Nobel Laureate",
    works: "Gitanjali, Gora, The Postmaster",
    bio: "Asia’s first Nobel laureate, whose poetry, stories and songs transformed Bengali literature and continue to inspire readers across generations.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM1qBsjaMPs9D00G12QGLwHclccepERlku-OHdBPWkBviHmB7UikEIzMg&s=10",
  },
  {
    name: "R. K. Narayan",
    genre: "Indian Fiction · Malgudi Chronicles",
    works: "Swami and Friends, The Guide",
    bio: "One of India’s most beloved English-language storytellers, remembered for bringing the fictional town of Malgudi to life with warmth, humour and simplicity.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsS5CDp911FarOEtnSk-IaPY2T-U2LEsxOMb2yz7j96UCoiHxuG7Od1uUF&s=10",
  },
  {
    name: "Satyajit Ray",
    genre: "Mystery · Science Fiction · Cinema",
    works: "Feluda, Professor Shonku",
    bio: "Legendary filmmaker, illustrator and writer who created Feluda and Professor Shonku, two of the most iconic characters in Bengali popular literature.",
    image:
      "https://m.media-amazon.com/images/M/MV5BNTAyOTRkY2YtZWM4NS00Yzk1LWFhZjAtYzIxZjY5NDNmZGU2XkEyXkFqcGc@._V1_.jpg",
  },
  {
    name: "Mulk Raj Anand",
    genre: "Indian Classics · Social Realism",
    works: "Untouchable, Coolie",
    bio: "A pioneering Indian novelist whose powerful stories explored inequality, dignity and everyday life with compassion and striking social realism.",
    image:
      "https://cdn-dlmfn.nitrocdn.com/WjhRAZnhnJlaJhMwVcEPYwfxtpYISNzb/assets/images/optimized/rev-afac40e/booksloveme.com/wp-content/uploads/2020/08/Mulk-raj.webp",
  },
  {
    name: "Arundhati Roy",
    genre: "Literary Fiction · Essays · Booker Winner",
    works: "The God of Small Things",
    bio: "Booker Prize-winning Indian novelist and essayist known for lyrical prose, unforgettable characters and deeply observed stories of society and place.",
    image: "https://cdn.britannica.com/96/167696-050-22B2A133/Arundhati-Roy.jpg",
  },
];

export const categories: Category[] = [
  { name: "Indian Novels", image: novelsImg, count: 128 },
  { name: "Poetry", image: poetryImg, count: 165 },
  { name: "Short Stories", image: shortImg, count: 202 },
  { name: "Spirituality", image: spiritualityImg, count: 239 },
  { name: "Politics & India", image: politicsImg, count: 276 },
  { name: "Sports", image: sport, count: 313 },
  { name: "Regional Translations", image: translationImg, count: 350 },
  { name: "E-Books", image: eBooksImg, count: 387 },
  { name: "Academic Books", image: textBooksImg, count: 424 },
];

export const publishers = [
  "Penguin Random House India",
  "Rupa Publications",
  "HarperCollins India",
  "Westland Books",
  "Aleph Book Company",
  "Juggernaut Books",
];

export const topicRows = [
  {
    eyebrow: "SHORT READS",
    title: "Stories for a Quiet Evening",
    copy: "Short reads from voices across India and beyond.",
    books: [books[1], books[5], books[6]],
  },
  {
    eyebrow: "INNER LIFE",
    title: "Spirituality & Philosophy",
    copy: "Wisdom, reflection and ideas for the inner journey.",
    books: [books[5], books[6], books[3]],
  },
  {
    eyebrow: "INDIA & THE WORLD",
    title: "Politics & Current Affairs",
    copy: "Perspectives on India, democracy and a changing world.",
    books: [books[4], books[7], books[1]],
  },
  {
    eyebrow: "BEYOND THE FIELD",
    title: "Sport & Culture",
    copy: "Icons, rivalries and stories that became part of our culture.",
    books: [books[0], books[4], books[2]],
  },
];
