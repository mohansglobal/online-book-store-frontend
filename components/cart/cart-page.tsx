"use client";

import {
    useState,
    type FormEvent,
} from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    CheckCircle2,
    Heart,
    Minus,
    Plus,
    RefreshCw,
    RotateCcw,
    ShieldCheck,
    Trash2,
    Truck,
} from "lucide-react";
import { toast } from "sonner";

import { CategoryBanner } from "../categories/components/CategoryBanner";

import coverMasti from "../../assets/mastisker-malikana.jpg";
import coverKhoab from "../../assets/khoabnama.jpg";
import cartIllustration from "../../assets/cart.png";

type BookFormat =
    | "Hardcover"
    | "Paperback"
    | "E-Book";

interface CartItem {
    id: string;
    title: string;
    bengaliTitle: string;
    author: string;
    image: ImageProps["src"];
    price: number;
    mrp: number;
    quantity: number;
    stockLeft: number;
    sellerId: string;
    format: BookFormat;
    isWishlisted: boolean;
}

const INITIAL_CART_ITEMS: CartItem[] = [
    {
        id: "item-1",
        title: "Mastisker Malikana",
        bengaliTitle: "মস্তিষ্কের মালিকানা",
        author: "Humayun Ahmed",
        image: coverMasti,
        price: 100,
        mrp: 140,
        quantity: 1,
        stockLeft: 5,
        sellerId: "A2ZC141",
        format: "Hardcover",
        isWishlisted: false,
    },
    {
        id: "item-2",
        title: "Khoabnama",
        bengaliTitle:
            "খোয়াবনামা (আনন্দ পুরস্কারপ্রাপ্ত)",
        author: "Akhtaruzzaman Elias",
        image: coverKhoab,
        price: 338,
        mrp: 450,
        quantity: 1,
        stockLeft: 3,
        sellerId: "A2ZC141",
        format: "Hardcover",
        isWishlisted: false,
    },
];

const DELIVERY_CHARGE: number = 0;

export default function CartPage() {
    const router = useRouter();

    const [cartItems, setCartItems] =
        useState<CartItem[]>(INITIAL_CART_ITEMS);

    const [isCheckingOut, setIsCheckingOut] =
        useState(false);

    const [couponCode, setCouponCode] =
        useState("");

    const [appliedCoupon, setAppliedCoupon] =
        useState<string | null>(null);

    const [couponDiscount, setCouponDiscount] =
        useState(0);

    /*
     * Calculations
     */
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0,
    );

    const totalMrp = cartItems.reduce(
        (total, item) =>
            total + item.mrp * item.quantity,
        0,
    );

    const mrpSavings = Math.max(
        0,
        totalMrp - subtotal,
    );

    const totalSavings =
        mrpSavings + couponDiscount;

    const grandTotal = Math.max(
        0,
        subtotal -
        couponDiscount +
        DELIVERY_CHARGE,
    );

    const totalCount = cartItems.reduce(
        (total, item) =>
            total + item.quantity,
        0,
    );

    const wishCount = cartItems.filter(
        (item) => item.isWishlisted,
    ).length;

    /*
     * Quantity
     */
    const handleUpdateQuantity = (
        id: string,
        delta: -1 | 1,
    ): void => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                const newQuantity =
                    item.quantity + delta;

                if (newQuantity < 1) {
                    return item;
                }

                if (
                    newQuantity > item.stockLeft
                ) {
                    toast.error(
                        `Only ${item.stockLeft} copies available in stock!`,
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity: newQuantity,
                };
            }),
        );
    };

    const handleQuantityInput = (
        id: string,
        value: string,
    ): void => {
        const quantity = Number.parseInt(
            value,
            10,
        );

        if (
            Number.isNaN(quantity) ||
            quantity < 1
        ) {
            return;
        }

        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: Math.min(
                            item.stockLeft,
                            quantity,
                        ),
                    }
                    : item,
            ),
        );
    };

    /*
     * Wishlist
     */
    const handleToggleWishlist = (
        id: string,
    ): void => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                const nextState =
                    !item.isWishlisted;

                toast[
                    nextState
                        ? "success"
                        : "info"
                ](
                    nextState
                        ? `Added "${item.bengaliTitle}" to your wishlist!`
                        : `Removed "${item.bengaliTitle}" from wishlist`,
                );

                return {
                    ...item,
                    isWishlisted: nextState,
                };
            }),
        );
    };

    /*
     * Remove Item
     */
    const handleRemoveItem = (
        itemToRemove: CartItem,
    ): void => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    item.id !== itemToRemove.id,
            ),
        );

        toast.success(
            `Removed "${itemToRemove.bengaliTitle}"`,
            {
                action: {
                    label: "Undo",

                    onClick: () => {
                        setCartItems(
                            (currentItems) => [
                                itemToRemove,
                                ...currentItems,
                            ],
                        );

                        toast.info(
                            `Restored "${itemToRemove.bengaliTitle}"`,
                        );
                    },
                },
            },
        );
    };

    /*
     * Coupon
     */
    const handleApplyCoupon = (
        event: FormEvent<HTMLFormElement>,
    ): void => {
        event.preventDefault();

        const code = couponCode
            .trim()
            .toUpperCase();

        if (!code) {
            return;
        }

        if (
            code === "BENGAL10" ||
            code === "WELCOME10"
        ) {
            const discount =
                subtotal * 0.1;

            setCouponDiscount(discount);
            setAppliedCoupon(code);

            toast.success(
                `Coupon "${code}" applied! 10% discount added.`,
            );

            return;
        }

        if (code === "FREESHIP") {
            toast.success(
                "Free delivery is already applied to your order!",
            );

            return;
        }

        toast.error(
            "Invalid coupon code. Try 'BENGAL10'.",
        );
    };

    /*
     * Checkout
     */
    const handleProceedToCheckout =
        (): void => {
            setIsCheckingOut(true);

            window.setTimeout(() => {
                router.push("/checkout");
            }, 300);
        };

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
            <CategoryBanner
                categoryName=""
                compact
            />

            <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                            {/* Cart Items */}
                            <div className="flex flex-col gap-3 lg:col-span-8">
                                {cartItems.map((item) => (
                                    <article
                                        key={item.id}
                                        className="group flex items-stretch overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:border-border-hover hover:shadow-sm"
                                    >
                                        {/* Cover */}
                                        <div className="relative w-24 shrink-0 overflow-hidden border-r border-border/50 bg-surface-soft sm:w-32">
                                            <Image
                                                src={item.image}
                                                alt={`${item.title} cover`}
                                                fill
                                                sizes="(max-width: 640px) 96px, 128px"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/books/${item.id}`}
                                                        className="line-clamp-2 text-sm leading-tight font-bold text-foreground transition-colors hover:text-accent sm:text-base"
                                                    >
                                                        {item.title}
                                                    </Link>

                                                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                                        <span className="max-w-[120px] truncate font-medium text-text-secondary sm:max-w-none">
                                                            {item.author}
                                                        </span>

                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-border" />

                                                        <span className="truncate">
                                                            Seller:{" "}
                                                            {item.sellerId}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Wishlist */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleWishlist(
                                                            item.id,
                                                        )
                                                    }
                                                    title={
                                                        item.isWishlisted
                                                            ? "Remove from wishlist"
                                                            : "Add to wishlist"
                                                    }
                                                    aria-label={
                                                        item.isWishlisted
                                                            ? `Remove ${item.title} from wishlist`
                                                            : `Add ${item.title} to wishlist`
                                                    }
                                                    className="mt-0.5 flex shrink-0 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:text-accent"
                                                >
                                                    <Heart
                                                        size={18}
                                                        className={
                                                            item.isWishlisted
                                                                ? "fill-accent text-accent"
                                                                : ""
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                                                <span className="text-lg font-bold tracking-tight text-foreground">
                                                    <span className="font-sans">
                                                        ₹
                                                    </span>

                                                    {item.price.toFixed(
                                                        2,
                                                    )}
                                                </span>

                                                {item.mrp >
                                                    item.price && (
                                                        <>
                                                            <span className="text-xs text-muted-foreground line-through decoration-border">
                                                                ₹
                                                                {item.mrp.toFixed(
                                                                    2,
                                                                )}
                                                            </span>

                                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                                (
                                                                {Math.round(
                                                                    ((item.mrp -
                                                                        item.price) /
                                                                        item.mrp) *
                                                                    100,
                                                                )}
                                                                % OFF)
                                                            </span>
                                                        </>
                                                    )}
                                            </div>

                                            <div className="mt-auto pt-3" />

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
                                                <div className="flex items-center gap-3">
                                                    {/* Quantity */}
                                                    <div className="flex h-7 items-center overflow-hidden rounded-md border border-border bg-background">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    -1,
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                            aria-label={`Decrease quantity of ${item.title}`}
                                                            className="flex h-full w-7 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                                                        >
                                                            <Minus
                                                                size={12}
                                                            />
                                                        </button>

                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            aria-label={`Quantity of ${item.title}`}
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleQuantityInput(
                                                                    item.id,
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-full w-8 border-x border-border bg-transparent text-center text-xs font-bold text-foreground outline-none"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    1,
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity >=
                                                                item.stockLeft
                                                            }
                                                            aria-label={`Increase quantity of ${item.title}`}
                                                            className="flex h-full w-7 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                                                        >
                                                            <Plus
                                                                size={12}
                                                            />
                                                        </button>
                                                    </div>

                                                    {/* Stock */}
                                                    <div className="hidden items-center gap-1 text-[10px] font-medium text-emerald-600 sm:flex dark:text-emerald-400">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                                                        <span>
                                                            {item.stockLeft <=
                                                                3
                                                                ? `Only ${item.stockLeft} left`
                                                                : "In Stock"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item,
                                                        )
                                                    }
                                                    title="Remove item"
                                                    className="flex cursor-pointer items-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                                                >
                                                    <Trash2
                                                        size={14}
                                                    />

                                                    <span className="hidden sm:inline">
                                                        Remove
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <aside className="sticky top-24 space-y-5 lg:col-span-4">
                                <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
                                    <h2 className="mb-5 border-b border-border pb-3 text-lg font-semibold">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex justify-between">
                                            <span>Total MRP</span>

                                            <span className="text-muted-foreground line-through">
                                                ₹
                                                {totalMrp.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>
                                                Subtotal
                                                (Discounted)
                                            </span>

                                            <span className="font-medium text-foreground">
                                                ₹
                                                {subtotal.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Shipping</span>

                                            <span className="font-medium text-foreground">
                                                {DELIVERY_CHARGE === 0
                                                    ? "Free"
                                                    : `₹${(DELIVERY_CHARGE as number).toFixed(2)}`}
                                            </span>
                                        </div>

                                        {couponDiscount >
                                            0 && (
                                                <div className="flex justify-between font-medium text-accent">
                                                    <span>
                                                        Coupon Savings
                                                    </span>

                                                    <span>
                                                        -₹
                                                        {couponDiscount.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    {/* Total */}
                                    <div className="my-5 border-t border-border pt-4">
                                        <div className="flex items-end justify-between">
                                            <span className="text-base font-medium">
                                                Total
                                            </span>

                                            <span className="text-2xl font-bold tracking-tight">
                                                ₹
                                                {grandTotal.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </div>

                                        {totalSavings > 0 && (
                                            <div className="mt-1.5 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                You saved ₹
                                                {totalSavings.toFixed(
                                                    2,
                                                )}{" "}
                                                on this order!
                                            </div>
                                        )}
                                    </div>

                                    {/* Checkout */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleProceedToCheckout
                                        }
                                        disabled={
                                            isCheckingOut
                                        }
                                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent font-semibold text-white shadow-sm transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <RefreshCw
                                                    size={18}
                                                    className="animate-spin"
                                                />

                                                Processing...
                                            </>
                                        ) : (
                                            "Proceed to Checkout"
                                        )}
                                    </button>

                                    {/* Coupon */}
                                    <div className="mt-6 border-t border-border pt-5">
                                        <form
                                            onSubmit={
                                                handleApplyCoupon
                                            }
                                            className="flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={
                                                    couponCode
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    setCouponCode(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                placeholder="Gift or promo code"
                                                aria-label="Gift or promo code"
                                                className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                                            />

                                            <button
                                                type="submit"
                                                className="h-10 cursor-pointer rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                                            >
                                                Apply
                                            </button>
                                        </form>

                                        {appliedCoupon && (
                                            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                                                <CheckCircle2
                                                    size={14}
                                                />

                                                Code{" "}
                                                {appliedCoupon}{" "}
                                                applied
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Assurance */}
                                <div className="flex items-center justify-center gap-4 rounded-lg border border-border bg-surface-soft px-2 py-4 text-xs text-muted-foreground">
                                    <div className="flex flex-col items-center gap-1">
                                        <ShieldCheck
                                            size={18}
                                            className="text-primary"
                                        />

                                        <span>
                                            Genuine
                                        </span>
                                    </div>

                                    <div className="h-6 w-px bg-border" />

                                    <div className="flex flex-col items-center gap-1">
                                        <Truck
                                            size={18}
                                            className="text-primary"
                                        />

                                        <span>
                                            Fast Delivery
                                        </span>
                                    </div>

                                    <div className="h-6 w-px bg-border" />

                                    <div className="flex flex-col items-center gap-1">
                                        <RotateCcw
                                            size={18}
                                            className="text-primary"
                                        />

                                        <span>
                                            Easy Returns
                                        </span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        /* Empty Cart */
                        <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
                            <div className="relative mb-8 w-56 sm:w-64">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 rounded-full bg-accent/5 blur-2xl"
                                />

                                <Image
                                    src={cartIllustration}
                                    alt="Illustration of an empty shopping cart"
                                    className="pointer-events-none mx-auto h-auto w-full select-none object-contain"
                                />
                            </div>

                            <div className="mx-auto mb-8 max-w-md space-y-3">
                                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Your cart is feeling
                                    light
                                </h2>

                                <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                                    Looks like you
                                    haven&apos;t added
                                    any books to your
                                    cart yet. Discover
                                    your next great read
                                    today.
                                </p>
                            </div>

                            <Link
                                href="/#books"
                                className="w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:w-auto"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}