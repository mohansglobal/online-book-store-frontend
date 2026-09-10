"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Copy,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import AdminTopNav from "../books/components/AdminTopNav";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import {
  Footer,
  Navbar,
} from "@/components/home/components";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import bookFineBalance from "../../assets/fineBalance.jpeg";
import bookMidnightsChildren from "../../assets/midnightsChildren.jpeg";
import bookNamesake from "../../assets/namesake.jpeg";
import bookPalaceIllusions from "../../assets/palaceIllusions.jpeg";
import bookPatherPanchali from "../../assets/patherpanchali.jpeg";
import bookWhiteTiger from "../../assets/whiteTiger.jpeg";
import coverKhoab from "../../assets/khoabnama.jpg";
import coverMasti from "../../assets/mastisker-malikana.jpg";

export type DiscountType =
  | "percentage"
  | "amount";

type DiscountFilter =
  | "all"
  | "active"
  | DiscountType;

export interface BookDiscountItem {
  id: string;
  sl: number;
  isbn: string;
  photo: ImageProps["src"];
  nameEn: string;
  nameBn: string;
  author: string;
  price: number;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const INITIAL_DISCOUNT_BOOKS: BookDiscountItem[] = [
  {
    id: "disc-1",
    sl: 1,
    isbn: "978-984-502-140-1",
    photo: coverMasti,
    nameEn: "Mastisker Malikana",
    nameBn: "মস্তিষ্কের মালিকানা",
    author: "Humayun Ahmed",
    price: 140,
    discountType: "percentage",
    discountValue: 25,
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    isActive: true,
  },
  {
    id: "disc-2",
    sl: 2,
    isbn: "978-81-7215-385-4",
    photo: coverKhoab,
    nameEn: "Khoabnama",
    nameBn: "খোয়াবনামা",
    author: "Akhtaruzzaman Elias",
    price: 450,
    discountType: "amount",
    discountValue: 112,
    startDate: "2026-09-01",
    endDate: "2026-09-25",
    isActive: true,
  },
  {
    id: "disc-3",
    sl: 3,
    isbn: "978-0-14-027976-4",
    photo: bookFineBalance,
    nameEn: "A Fine Balance",
    nameBn: "আ ফাইন ব্যালেন্স",
    author: "Rohinton Mistry",
    price: 500,
    discountType: "percentage",
    discountValue: 10,
    startDate: "2026-09-05",
    endDate: "2026-10-05",
    isActive: true,
  },
  {
    id: "disc-4",
    sl: 4,
    isbn: "978-0-09-957851-2",
    photo: bookMidnightsChildren,
    nameEn: "Midnight's Children",
    nameBn: "মিডনাইটস চিলড্রেন",
    author: "Salman Rushdie",
    price: 650,
    discountType: "percentage",
    discountValue: 20,
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    isActive: true,
  },
  {
    id: "disc-5",
    sl: 5,
    isbn: "978-0-00-727530-4",
    photo: bookNamesake,
    nameEn: "The Namesake",
    nameBn: "দ্য নেমসেক",
    author: "Jhumpa Lahiri",
    price: 350,
    discountType: "amount",
    discountValue: 50,
    startDate: "2026-09-10",
    endDate: "2026-09-20",
    isActive: false,
  },
  {
    id: "disc-6",
    sl: 6,
    isbn: "978-1-40-009693-0",
    photo: bookPalaceIllusions,
    nameEn: "The Palace of Illusions",
    nameBn: "দ্য প্যালেস অব ইলিউশনস",
    author: "Chitra Banerjee",
    price: 420,
    discountType: "percentage",
    discountValue: 15,
    startDate: "2026-09-01",
    endDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "disc-7",
    sl: 7,
    isbn: "978-1-41-656260-3",
    photo: bookWhiteTiger,
    nameEn: "The White Tiger",
    nameBn: "দ্য হোয়াইট টাইগার",
    author: "Aravind Adiga",
    price: 399,
    discountType: "amount",
    discountValue: 0,
    startDate: "",
    endDate: "",
    isActive: false,
  },
  {
    id: "disc-8",
    sl: 8,
    isbn: "978-81-7079-052-5",
    photo: bookPatherPanchali,
    nameEn: "Pather Panchali",
    nameBn: "পথের পাঁচালী",
    author: "Bibhutibhushan Bandyopadhyay",
    price: 300,
    discountType: "percentage",
    discountValue: 30,
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    isActive: true,
  },
];

const DISCOUNT_FILTERS: readonly {
  id: DiscountFilter;
  label: string;
}[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "active",
    label: "Active Deals",
  },
  {
    id: "percentage",
    label: "Percentage (%)",
  },
  {
    id: "amount",
    label: "Flat (₹)",
  },
];

const INPUT_CLASS_NAME =
  "h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent";

const LABEL_CLASS_NAME =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary";

function calculateFinalPrice(
  price: number,
  type: DiscountType,
  value: number,
  isActive: boolean,
): number {
  if (!isActive || value <= 0) {
    return price;
  }

  if (type === "percentage") {
    const safePercentage = Math.min(
      100,
      Math.max(0, value),
    );

    const discount =
      (price * safePercentage) / 100;

    return Math.max(
      0,
      Math.round(price - discount),
    );
  }

  return Math.max(
    0,
    Math.round(price - value),
  );
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultEndDate(): string {
  const date = new Date();

  date.setDate(
    date.getDate() + 30,
  );

  return formatDateInput(date);
}

function isDiscountType(
  value: string,
): value is DiscountType {
  return (
    value === "percentage" ||
    value === "amount"
  );
}

export default function ManageDiscountsPage() {
  const [items, setItems] =
    useState<BookDiscountItem[]>(
      INITIAL_DISCOUNT_BOOKS,
    );

  const [searchTerm, setSearchTerm] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState<DiscountFilter>("all");

  const [copiedIsbn, setCopiedIsbn] =
    useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedBook, setSelectedBook] =
    useState<BookDiscountItem | null>(
      null,
    );

  const [
    modalDiscountType,
    setModalDiscountType,
  ] =
    useState<DiscountType>(
      "percentage",
    );

  const [
    modalDiscountValue,
    setModalDiscountValue,
  ] = useState(0);

  const [
    modalStartDate,
    setModalStartDate,
  ] = useState("");

  const [
    modalEndDate,
    setModalEndDate,
  ] = useState("");

  const [
    modalIsActive,
    setModalIsActive,
  ] = useState(true);

  const handleOpenDiscountModal = (
    book: BookDiscountItem,
  ): void => {
    setSelectedBook(book);

    setModalDiscountType(
      book.discountType,
    );

    setModalDiscountValue(
      book.discountValue,
    );

    setModalStartDate(
      book.startDate ||
        formatDateInput(new Date()),
    );

    setModalEndDate(
      book.endDate ||
        getDefaultEndDate(),
    );

    setModalIsActive(book.isActive);

    setIsModalOpen(true);
  };

  const handleSaveModalDiscount =
    (): void => {
      if (!selectedBook) {
        return;
      }

      if (modalDiscountValue < 0) {
        toast.error(
          "Discount value cannot be negative.",
        );
        return;
      }

      if (
        modalDiscountType ===
          "percentage" &&
        modalDiscountValue > 100
      ) {
        toast.error(
          "Percentage discount cannot exceed 100%.",
        );
        return;
      }

      if (
        modalDiscountType ===
          "amount" &&
        modalDiscountValue >
          selectedBook.price
      ) {
        toast.error(
          `Discount cannot exceed book price (₹${selectedBook.price}).`,
        );

        return;
      }

      if (
        modalStartDate &&
        modalEndDate &&
        modalEndDate < modalStartDate
      ) {
        toast.error(
          "End date cannot be before the start date.",
        );

        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === selectedBook.id
            ? {
                ...item,
                discountType:
                  modalDiscountType,
                discountValue:
                  modalDiscountValue,
                startDate:
                  modalStartDate,
                endDate:
                  modalEndDate,
                isActive:
                  modalIsActive,
              }
            : item,
        ),
      );

      const finalPrice =
        calculateFinalPrice(
          selectedBook.price,
          modalDiscountType,
          modalDiscountValue,
          modalIsActive,
        );

      toast.success(
        `Discount updated for "${selectedBook.nameEn}"! (Final Price: ₹${finalPrice})`,
      );

      setIsModalOpen(false);
  };

  const handleToggleActive = (
    id: string,
  ): void => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextState =
          !item.isActive;

        toast.info(
          `Discount for "${item.nameEn}" is now ${
            nextState
              ? "Active"
              : "Disabled"
          }.`,
        );

        return {
          ...item,
          isActive: nextState,
        };
      }),
    );
  };

  const handleResetDiscount = (
    book: BookDiscountItem,
  ): void => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === book.id
          ? {
              ...item,
              discountValue: 0,
              startDate: "",
              endDate: "",
              isActive: false,
            }
          : item,
      ),
    );

    toast.info(
      `Discount removed for "${book.nameEn}".`,
    );
  };

  const handleCopyIsbn = async (
    isbn: string,
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(
        isbn,
      );

      setCopiedIsbn(isbn);

      toast.success("ISBN copied");

      window.setTimeout(() => {
        setCopiedIsbn(null);
      }, 2000);
    } catch {
      toast.error(
        "Unable to copy ISBN",
      );
    }
  };

  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const filteredItems = items.filter(
    (item) => {
      const matchesSearch =
        item.nameEn
          .toLowerCase()
          .includes(normalizedSearch) ||
        item.nameBn.includes(
          searchTerm.trim(),
        ) ||
        item.isbn
          .toLowerCase()
          .includes(normalizedSearch) ||
        item.author
          .toLowerCase()
          .includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      if (typeFilter === "all") {
        return true;
      }

      if (typeFilter === "active") {
        return (
          item.isActive &&
          item.discountValue > 0
        );
      }

      return (
        item.discountType ===
          typeFilter &&
        item.discountValue > 0
      );
    },
  );

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner
        categoryName=""
        compact
      />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="discounts" />

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            {/* Toolbar */}
            <div className="flex flex-col items-center justify-between gap-3 border-b border-border bg-surface-soft/40 p-4 sm:flex-row sm:p-5">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search
                  size={16}
                  aria-hidden="true"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  placeholder="Search by Title, ISBN, Author..."
                  aria-label="Search discount books"
                  className="h-9 rounded-md border-border bg-background pl-9 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex w-full items-center gap-1.5 overflow-x-auto sm:w-auto">
                {DISCOUNT_FILTERS.map(
                  (filter) => {
                    const isActive =
                      typeFilter ===
                      filter.id;

                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() =>
                          setTypeFilter(
                            filter.id,
                          )
                        }
                        aria-pressed={
                          isActive
                        }
                        className={`cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-accent text-white shadow-xs"
                            : "border border-border bg-background text-text-secondary hover:bg-surface-hover"
                        }`}
                      >
                        {
                          filter.label
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Discount Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-background text-xs font-medium text-text-secondary">
                  <tr>
                    <th className="w-auto px-5 py-3">
                      Book
                    </th>

                    <th className="w-32 px-4 py-3">
                      Price
                    </th>

                    <th className="w-62 px-4 py-3">
                      Validity
                    </th>

                    <th className="w-20 px-4 py-3 text-center">
                      Status
                    </th>

                    <th className="w-24 px-5 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/50">
                  {filteredItems.length >
                  0 ? (
                    filteredItems.map(
                      (item) => {
                        const finalPrice =
                          calculateFinalPrice(
                            item.price,
                            item.discountType,
                            item.discountValue,
                            item.isActive,
                          );

                        const hasDiscount =
                          item.isActive &&
                          item.discountValue >
                            0;

                        return (
                          <tr
                            key={
                              item.id
                            }
                            className="group transition-colors hover:bg-surface-soft/40"
                          >
                            {/* Book */}
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    item.photo
                                  }
                                  alt={`${item.nameEn} cover`}
                                  width={
                                    36
                                  }
                                  height={
                                    48
                                  }
                                  className="h-12 w-9 shrink-0 rounded-[4px] border border-border object-cover"
                                />

                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-foreground">
                                    {
                                      item.nameEn
                                    }
                                  </div>

                                  <div className="truncate text-xs text-muted-foreground">
                                    {
                                      item.author
                                    }
                                  </div>

                                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                    <span>
                                      {
                                        item.isbn
                                      }
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        void handleCopyIsbn(
                                          item.isbn,
                                        )
                                      }
                                      aria-label={`Copy ISBN ${item.isbn}`}
                                      title="Copy ISBN"
                                      className="cursor-pointer transition-colors hover:text-accent"
                                    >
                                      {copiedIsbn ===
                                      item.isbn ? (
                                        <Check
                                          size={
                                            10
                                          }
                                          aria-hidden="true"
                                          className="text-emerald-500"
                                        />
                                      ) : (
                                        <Copy
                                          size={
                                            10
                                          }
                                          aria-hidden="true"
                                        />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3.5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-sans text-sm font-bold tracking-tight tabular-nums ${
                                      hasDiscount
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-foreground"
                                    }`}
                                  >
                                    ₹
                                    {
                                      finalPrice
                                    }
                                  </span>

                                  {hasDiscount && (
                                    <span className="font-sans text-xs text-muted-foreground line-through tabular-nums">
                                      ₹
                                      {
                                        item.price
                                      }
                                    </span>
                                  )}
                                </div>

                                {hasDiscount && (
                                  <span className="inline-flex w-max items-center rounded-full bg-accent px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow-2xs">
                                    {item.discountType ===
                                    "percentage"
                                      ? `${item.discountValue}% OFF`
                                      : `₹${item.discountValue} FLAT`}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Validity */}
                            <td className="px-4 py-3.5">
                              {item.startDate &&
                              item.endDate ? (
                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                  <Calendar
                                    size={
                                      13
                                    }
                                    aria-hidden="true"
                                    className="shrink-0 text-accent"
                                  />

                                  <div className="flex items-center gap-1 font-sans text-xs font-medium text-text-secondary tabular-nums">
                                    <span>
                                      {
                                        item.startDate
                                      }
                                    </span>

                                    <ArrowRight
                                      size={
                                        11
                                      }
                                      aria-hidden="true"
                                      className="shrink-0 text-muted-foreground"
                                    />

                                    <span>
                                      {
                                        item.endDate
                                      }
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5 text-center">
                              <Switch
                                checked={
                                  item.isActive
                                }
                                onCheckedChange={() =>
                                  handleToggleActive(
                                    item.id,
                                  )
                                }
                                aria-label={`Toggle discount for ${item.nameEn}`}
                                className="scale-90 cursor-pointer data-[state=checked]:bg-accent data-[state=unchecked]:bg-border"
                              />
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenDiscountModal(
                                      item,
                                    )
                                  }
                                  className="h-8 cursor-pointer rounded-md bg-accent px-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent-hover"
                                >
                                  <SlidersHorizontal
                                    size={
                                      12
                                    }
                                    aria-hidden="true"
                                    className="mr-1"
                                  />

                                  Discount
                                </Button>

                                {item.discountValue >
                                  0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleResetDiscount(
                                        item,
                                      )
                                    }
                                    title="Remove Discount"
                                    aria-label={`Remove discount from ${item.nameEn}`}
                                    className="cursor-pointer rounded-md border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                                  >
                                    <RotateCcw
                                      size={
                                        13
                                      }
                                      aria-hidden="true"
                                    />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      },
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <BookOpen
                            size={24}
                            aria-hidden="true"
                            className="opacity-40"
                          />

                          <p className="text-sm font-medium">
                            No books
                            found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Discount Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className="rounded-xl border border-border bg-surface p-6 text-foreground shadow-2xl sm:max-w-md">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="flex items-center gap-2 font-display text-base font-bold text-foreground">
              <Tag
                size={16}
                aria-hidden="true"
                className="text-accent"
              />

              Configure Book Discount
            </DialogTitle>

            <DialogDescription className="text-xs text-text-secondary">
              Set promotional discount
              rates and campaign date
              ranges for this book.
            </DialogDescription>
          </DialogHeader>

          {selectedBook && (
            <div className="space-y-4 py-2">
              {/* Selected Book */}
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                <Image
                  src={
                    selectedBook.photo
                  }
                  alt={`${selectedBook.nameEn} cover`}
                  width={40}
                  height={56}
                  className="h-14 w-10 shrink-0 rounded border border-border object-cover shadow-xs"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-foreground">
                    {
                      selectedBook.nameEn
                    }
                  </h3>

                  <p className="truncate text-xs text-muted-foreground">
                    {
                      selectedBook.author
                    }
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-accent">
                    MRP: ₹
                    {
                      selectedBook.price
                    }
                  </p>
                </div>
              </div>

              {/* Discount Type */}
              <div className="space-y-1.5">
                <Label
                  className={
                    LABEL_CLASS_NAME
                  }
                >
                  Discount Type{" "}
                  <span className="text-accent">
                    *
                  </span>
                </Label>

                <Select
                  value={
                    modalDiscountType
                  }
                  onValueChange={(
                    value,
                  ) => {
                    if (
                      isDiscountType(
                        value,
                      )
                    ) {
                      setModalDiscountType(
                        value,
                      );
                    }
                  }}
                >
                  <SelectTrigger className="h-10 cursor-pointer rounded-md border-border bg-background text-xs text-foreground focus:ring-1 focus:ring-accent">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="z-[100] border-border bg-surface p-1 text-foreground shadow-2xl">
                    <SelectItem
                      value="percentage"
                      className="cursor-pointer rounded-sm py-2 text-xs transition-colors focus:bg-accent focus:text-white data-[state=checked]:bg-accent data-[state=checked]:font-semibold data-[state=checked]:text-white"
                    >
                      Percentage (%)
                      Discount
                    </SelectItem>

                    <SelectItem
                      value="amount"
                      className="cursor-pointer rounded-sm py-2 text-xs transition-colors focus:bg-accent focus:text-white data-[state=checked]:bg-accent data-[state=checked]:font-semibold data-[state=checked]:text-white"
                    >
                      Flat Amount (₹)
                      Discount
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Value */}
              <div className="space-y-1.5">
                <Label
                  className={
                    LABEL_CLASS_NAME
                  }
                >
                  {modalDiscountType ===
                  "percentage"
                    ? "Percentage Off (%)"
                    : "Amount Off (₹)"}{" "}
                  <span className="text-accent">
                    *
                  </span>
                </Label>

                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={
                      modalDiscountType ===
                      "percentage"
                        ? 100
                        : selectedBook.price
                    }
                    value={
                      modalDiscountValue
                    }
                    onChange={(event) =>
                      setModalDiscountValue(
                        Number.parseFloat(
                          event.target
                            .value,
                        ) || 0,
                      )
                    }
                    className={`${INPUT_CLASS_NAME} pr-8 font-sans font-medium tabular-nums`}
                  />

                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-accent">
                    {modalDiscountType ===
                    "percentage"
                      ? "%"
                      : "₹"}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="discountStartDate"
                    className={
                      LABEL_CLASS_NAME
                    }
                  >
                    Start Date
                  </Label>

                  <Input
                    id="discountStartDate"
                    type="date"
                    value={
                      modalStartDate
                    }
                    onChange={(event) =>
                      setModalStartDate(
                        event.target
                          .value,
                      )
                    }
                    className={`${INPUT_CLASS_NAME} px-3 text-xs`}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="discountEndDate"
                    className={
                      LABEL_CLASS_NAME
                    }
                  >
                    End Date
                  </Label>

                  <Input
                    id="discountEndDate"
                    type="date"
                    min={
                      modalStartDate ||
                      undefined
                    }
                    value={
                      modalEndDate
                    }
                    onChange={(event) =>
                      setModalEndDate(
                        event.target
                          .value,
                      )
                    }
                    className={`${INPUT_CLASS_NAME} px-3 text-xs`}
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Enable Promotion
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    Make this promotion
                    active immediately.
                  </p>
                </div>

                <Switch
                  checked={
                    modalIsActive
                  }
                  onCheckedChange={
                    setModalIsActive
                  }
                  aria-label="Enable promotion"
                  className="cursor-pointer data-[state=checked]:bg-accent data-[state=unchecked]:bg-border"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsModalOpen(false)
              }
              className="h-10 flex-1 cursor-pointer rounded-md border-border bg-transparent text-xs font-semibold text-foreground hover:bg-surface-hover"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={
                handleSaveModalDiscount
              }
              className="h-10 flex-1 cursor-pointer rounded-md bg-accent text-xs font-semibold text-white shadow-xs hover:bg-accent-hover"
            >
              Save Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}