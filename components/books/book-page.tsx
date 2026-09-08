"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import {
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    Edit2,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import AdminTopNav from "./components/AdminTopNav";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import bookFineBalance from "../../assets/fineBalance.jpeg";
import bookMidnightsChildren from "../../assets/midnightsChildren.jpeg";
import bookNamesake from "../../assets/namesake.jpeg";
import bookPalaceIllusions from "../../assets/palaceIllusions.jpeg";
import bookPatherPanchali from "../../assets/patherpanchali.jpeg";
import bookWhiteTiger from "../../assets/whiteTiger.jpeg";
import coverKhoab from "../../assets/khoabnama.jpg";
import coverMasti from "../../assets/mastisker-malikana.jpg";

type ProductStatus = "active" | "deactive";
type StatusFilter = "all" | ProductStatus;

export interface ProductItem {
    id: string;
    sl: number;
    isbn: string;
    photo: ImageProps["src"];
    titleEn: string;
    titleBn: string;
    author: string;
    category: string;
    stock: number;
    price: number;
    status: ProductStatus;
}

const INITIAL_PRODUCTS: ProductItem[] = [
    {
        id: "prod-1",
        sl: 1,
        isbn: "978-984-502-140-1",
        photo: coverMasti,
        titleEn: "Mastisker Malikana",
        titleBn: "মস্তিষ্কের মালিকানা",
        author: "Humayun Ahmed",
        category: "Science Fiction",
        stock: 24,
        price: 100,
        status: "active",
    },
    {
        id: "prod-2",
        sl: 2,
        isbn: "978-81-7215-385-4",
        photo: coverKhoab,
        titleEn: "Khoabnama",
        titleBn: "খোয়াবনামা",
        author: "Akhtaruzzaman Elias",
        category: "Classic Novel",
        stock: 8,
        price: 338,
        status: "active",
    },
    {
        id: "prod-3",
        sl: 3,
        isbn: "978-0-14-027976-4",
        photo: bookFineBalance,
        titleEn: "A Fine Balance",
        titleBn: "আ ফাইন ব্যালেন্স",
        author: "Rohinton Mistry",
        category: "Literary Fiction",
        stock: 15,
        price: 450,
        status: "active",
    },
    {
        id: "prod-4",
        sl: 4,
        isbn: "978-0-09-957851-2",
        photo: bookMidnightsChildren,
        titleEn: "Midnight's Children",
        titleBn: "মিডনাইটস চিলড্রেন",
        author: "Salman Rushdie",
        category: "Historical Fiction",
        stock: 3,
        price: 520,
        status: "active",
    },
    {
        id: "prod-5",
        sl: 5,
        isbn: "978-0-00-727530-4",
        photo: bookNamesake,
        titleEn: "The Namesake",
        titleBn: "দ্য নেমসেক",
        author: "Jhumpa Lahiri",
        category: "Contemporary",
        stock: 0,
        price: 299,
        status: "deactive",
    },
    {
        id: "prod-6",
        sl: 6,
        isbn: "978-1-40-009693-0",
        photo: bookPalaceIllusions,
        titleEn: "The Palace of Illusions",
        titleBn: "দ্য প্যালেস অব ইলিউশনস",
        author: "Chitra Banerjee",
        category: "Mythological",
        stock: 19,
        price: 380,
        status: "active",
    },
    {
        id: "prod-7",
        sl: 7,
        isbn: "978-1-41-656260-3",
        photo: bookWhiteTiger,
        titleEn: "The White Tiger",
        titleBn: "দ্য হোয়াইট টাইগার",
        author: "Aravind Adiga",
        category: "Drama",
        stock: 0,
        price: 350,
        status: "deactive",
    },
    {
        id: "prod-8",
        sl: 8,
        isbn: "978-81-7079-052-5",
        photo: bookPatherPanchali,
        titleEn: "Pather Panchali",
        titleBn: "পথের পাঁচালী",
        author: "Bibhutibhushan Bandyopadhyay",
        category: "Masterpiece",
        stock: 42,
        price: 240,
        status: "active",
    },
];

const STATUS_FILTERS: readonly StatusFilter[] = [
    "all",
    "active",
    "deactive",
];

export default function ProductListPage() {
    const [products, setProducts] =
        useState<ProductItem[]>(INITIAL_PRODUCTS);

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [copiedIsbn, setCopiedIsbn] =
        useState<string | null>(null);

    const handleToggleStatus = (id: string): void => {
        setProducts((currentProducts) =>
            currentProducts.map((product) => {
                if (product.id !== id) {
                    return product;
                }

                const newStatus: ProductStatus =
                    product.status === "active"
                        ? "deactive"
                        : "active";

                toast.success(
                    `"${product.titleEn}" marked as ${newStatus === "active"
                        ? "Active"
                        : "Deactivated"
                    }`,
                );

                return {
                    ...product,
                    status: newStatus,
                };
            }),
        );
    };

    const handleUpdateStock = (
        id: string,
        delta: -1 | 1,
    ): void => {
        setProducts((currentProducts) =>
            currentProducts.map((product) => {
                if (product.id !== id) {
                    return product;
                }

                const newStock = Math.max(
                    0,
                    product.stock + delta,
                );

                toast.info(
                    `Stock for "${product.titleEn}" updated to ${newStock}`,
                );

                return {
                    ...product,
                    stock: newStock,
                };
            }),
        );
    };

    const handleDeleteProduct = (
        productToDelete: ProductItem,
    ): void => {
        setProducts((currentProducts) =>
            currentProducts.filter(
                (product) =>
                    product.id !== productToDelete.id,
            ),
        );

        toast.success(
            `Product "${productToDelete.titleEn}" deleted successfully`,
            {
                action: {
                    label: "Undo",

                    onClick: () => {
                        setProducts((currentProducts) =>
                            [
                                ...currentProducts,
                                productToDelete,
                            ].sort((a, b) => a.sl - b.sl),
                        );

                        toast.info(
                            `Restored "${productToDelete.titleEn}"`,
                        );
                    },
                },
            },
        );
    };

    const handleCopyIsbn = async (
        isbn: string,
    ): Promise<void> => {
        try {
            await navigator.clipboard.writeText(isbn);

            setCopiedIsbn(isbn);

            toast.success(
                "ISBN copied to clipboard",
            );

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

    const filteredProducts = products.filter(
        (product) => {
            const matchesSearch =
                product.titleEn
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                product.titleBn.includes(searchTerm.trim()) ||
                product.isbn
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                product.author
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "all" ||
                product.status === statusFilter;

            return matchesSearch && matchesStatus;
        },
    );

    const totalCount = products.length;

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">


            <CategoryBanner
                categoryName=""
                compact
            />

            <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <AdminTopNav activeTab="inventory" />

                    {/* Table Container */}
                    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                        {/* Controls */}
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
                                    placeholder="Search by Title, ISBN, Author..."
                                    aria-label="Search products"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(
                                            event.target.value,
                                        )
                                    }
                                    className="h-9 rounded-md border-border bg-background pl-9 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
                                />
                            </div>

                            {/* Filters + Add Product */}
                            <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
                                <div className="flex items-center gap-1.5 overflow-x-auto">
                                    {STATUS_FILTERS.map(
                                        (status) => {
                                            const isActive =
                                                statusFilter === status;

                                            return (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() =>
                                                        setStatusFilter(
                                                            status,
                                                        )
                                                    }
                                                    aria-pressed={isActive}
                                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${isActive
                                                        ? "bg-accent text-white shadow-xs"
                                                        : "border border-border bg-background text-text-secondary hover:bg-surface-hover"
                                                        }`}
                                                >
                                                    {status === "all"
                                                        ? "All"
                                                        : status}
                                                </button>
                                            );
                                        },
                                    )}
                                </div>

                                <div className="hidden h-5 w-px bg-border sm:block" />

                                <Link
                                    href="/add-book"
                                    className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-accent px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent-hover hover:shadow active:scale-[0.98]"
                                >
                                    <Plus
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        Add Product
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="select-none border-b border-border bg-surface-soft/60 text-[11px] tracking-wider text-text-secondary uppercase">
                                    <tr>
                                        <th className="w-14 px-4 py-3.5 text-center font-bold">
                                            SL
                                        </th>

                                        <th className="w-20 px-4 py-3.5 font-bold">
                                            Photo
                                        </th>

                                        <th className="px-4 py-3.5 font-bold">
                                            ISBN
                                        </th>

                                        <th className="min-w-[200px] px-4 py-3.5 font-bold">
                                            Book Info
                                        </th>

                                        <th className="w-40 px-4 py-3.5 text-center font-bold">
                                            Stock
                                        </th>

                                        <th className="w-32 px-4 py-3.5 text-center font-bold">
                                            Status
                                        </th>

                                        <th className="w-32 px-4 py-3.5 pr-6 text-right font-bold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map(
                                            (product, index) => (
                                                <tr
                                                    key={product.id}
                                                    className="group transition-colors hover:bg-surface-soft/40"
                                                >
                                                    {/* SL */}
                                                    <td className="px-4 py-4 text-center font-sans text-xs text-muted-foreground tabular-nums">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(
                                                            2,
                                                            "0",
                                                        )}
                                                    </td>

                                                    {/* Cover */}
                                                    <td className="px-4 py-4">
                                                        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-soft shadow-xs transition-transform group-hover:scale-105">
                                                            <Image
                                                                src={
                                                                    product.photo
                                                                }
                                                                alt={`${product.titleEn} cover`}
                                                                fill
                                                                sizes="48px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* ISBN */}
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="rounded border border-border bg-background px-2 py-1 font-sans text-xs font-medium text-text-secondary tabular-nums">
                                                                {
                                                                    product.isbn
                                                                }
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    void handleCopyIsbn(
                                                                        product.isbn,
                                                                    )
                                                                }
                                                                title="Copy ISBN"
                                                                aria-label={`Copy ISBN ${product.isbn}`}
                                                                className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-background hover:text-accent"
                                                            >
                                                                {copiedIsbn ===
                                                                    product.isbn ? (
                                                                    <Check
                                                                        size={13}
                                                                        aria-hidden="true"
                                                                        className="text-emerald-600"
                                                                    />
                                                                ) : (
                                                                    <Copy
                                                                        size={13}
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Book Info */}
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-0.5">
                                                            <div className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                                                                {
                                                                    product.titleEn
                                                                }
                                                            </div>

                                                            <div className="line-clamp-1 text-xs text-muted-foreground">
                                                                {
                                                                    product.titleBn
                                                                }{" "}
                                                                &bull;{" "}
                                                                <span className="text-text-secondary">
                                                                    {
                                                                        product.author
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="text-[10px] text-muted-foreground">
                                                                <span className="mt-1 inline-block rounded border border-border bg-background px-1.5 py-0.5">
                                                                    {
                                                                        product.category
                                                                    }
                                                                </span>

                                                                <span className="ml-2 font-sans font-semibold text-text-secondary tabular-nums">
                                                                    ₹
                                                                    {
                                                                        product.price
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Stock */}
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="inline-flex flex-col items-center gap-1.5">
                                                            <div className="flex items-center overflow-hidden rounded-md border border-border bg-background shadow-2xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleUpdateStock(
                                                                            product.id,
                                                                            -1,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        product.stock <=
                                                                        0
                                                                    }
                                                                    title="Decrease stock"
                                                                    aria-label={`Decrease stock of ${product.titleEn}`}
                                                                    className="flex h-7 w-6 cursor-pointer items-center justify-center text-xs text-text-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
                                                                >
                                                                    −
                                                                </button>

                                                                <span className="w-10 text-center font-sans text-xs font-bold text-foreground tabular-nums">
                                                                    {
                                                                        product.stock
                                                                    }
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleUpdateStock(
                                                                            product.id,
                                                                            1,
                                                                        )
                                                                    }
                                                                    title="Increase stock"
                                                                    aria-label={`Increase stock of ${product.titleEn}`}
                                                                    className="flex h-7 w-6 cursor-pointer items-center justify-center text-xs text-text-secondary transition-colors hover:bg-surface-hover"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {product.stock ===
                                                                0 ? (
                                                                <span className="text-[10px] font-bold tracking-tight text-rose-500 uppercase">
                                                                    Out of stock
                                                                </span>
                                                            ) : product.stock <=
                                                                5 ? (
                                                                <span className="text-[10px] font-semibold tracking-tight text-amber-500">
                                                                    Low (
                                                                    {
                                                                        product.stock
                                                                    }{" "}
                                                                    left)
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                                                    In stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="inline-flex flex-col items-center gap-1.5">
                                                            <Switch
                                                                checked={
                                                                    product.status ===
                                                                    "active"
                                                                }
                                                                onCheckedChange={() =>
                                                                    handleToggleStatus(
                                                                        product.id,
                                                                    )
                                                                }
                                                                aria-label={`Toggle status for ${product.titleEn}`}
                                                                className="cursor-pointer data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-border"
                                                            />

                                                            <span
                                                                className={`text-[10px] font-bold tracking-wider uppercase ${product.status ===
                                                                    "active"
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : "text-muted-foreground"
                                                                    }`}
                                                            >
                                                                {product.status ===
                                                                    "active"
                                                                    ? "Active"
                                                                    : "Deactive"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-4 pr-6 text-right">
                                                        <div className="inline-flex items-center gap-1.5">
                                                            <Link
                                                                href="/add-book"
                                                                title="Edit product"
                                                                aria-label={`Edit ${product.titleEn}`}
                                                                className="cursor-pointer rounded-md border border-border bg-background p-1.5 text-text-secondary transition-colors hover:border-accent hover:bg-surface-hover hover:text-accent"
                                                            >
                                                                <Edit2
                                                                    size={14}
                                                                    aria-hidden="true"
                                                                />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteProduct(
                                                                        product,
                                                                    )
                                                                }
                                                                title="Delete product"
                                                                aria-label={`Delete ${product.titleEn}`}
                                                                className="cursor-pointer rounded-md border border-border bg-background p-1.5 text-text-secondary transition-colors hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                    aria-hidden="true"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <BookOpen
                                                        size={32}
                                                        aria-hidden="true"
                                                        className="opacity-40"
                                                    />

                                                    <p className="text-sm font-medium">
                                                        No products found
                                                    </p>

                                                    <p className="text-xs">
                                                        Try adjusting your
                                                        search or status
                                                        filter.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Pagination */}
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-surface-soft/20 p-4 text-xs text-text-secondary sm:flex-row">
                            <div>
                                Showing{" "}
                                <span className="font-semibold text-foreground">
                                    {
                                        filteredProducts.length
                                    }
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-foreground">
                                    {totalCount}
                                </span>{" "}
                                products
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    aria-label="Previous page"
                                    className="h-8 cursor-pointer rounded-md border-border bg-background px-2.5 text-muted-foreground disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft
                                        size={14}
                                        aria-hidden="true"
                                    />
                                </Button>

                                <button
                                    type="button"
                                    aria-current="page"
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-accent font-semibold text-white shadow-xs"
                                >
                                    1
                                </button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    aria-label="Next page"
                                    className="h-8 cursor-pointer rounded-md border-border bg-background px-2.5 text-muted-foreground disabled:cursor-not-allowed"
                                >
                                    <ChevronRight
                                        size={14}
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
}