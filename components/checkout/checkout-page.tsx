"use client";

import {
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import {
    Banknote,
    CheckCircle2,
    ChevronDown,
    CreditCard,
    Info,
    Lock,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Tag,
    Truck,
    Undo2,
    X,
} from "lucide-react";
import { toast } from "sonner";

import { CategoryBanner } from "../categories/components/CategoryBanner";


import coverKhoab from "../../assets/khoabnama.jpg";
import coverMasti from "../../assets/mastisker-malikana.jpg";

type BookFormat =
    | "Hardcover"
    | "Paperback"
    | "E-Book";

type PaymentMethod = "online" | "cod";

interface OrderBookItem {
    id: string;
    title: string;
    bengaliTitle: string;
    author: string;
    image: ImageProps["src"];
    price: number;
    mrp: number;
    quantity: number;
    format: BookFormat;
}

interface AddressDetails {
    name: string;
    country: string;
    state: string;
    city: string;
    address: string;
    flatNo: string;
    postcode: string;
    email: string;
    mobile: string;
}

interface FieldLabelProps {
    children: ReactNode;
    required?: boolean;
}

const ORDER_ITEMS: readonly OrderBookItem[] = [
    {
        id: "item-1",
        title: "Mastisker Malikana",
        bengaliTitle: "মস্তিষ্কের মালিকানা",
        author: "Humayun Ahmed",
        image: coverMasti,
        price: 100,
        mrp: 140,
        quantity: 1,
        format: "Hardcover",
    },
    {
        id: "item-2",
        title: "Khoabnama",
        bengaliTitle: "খোয়াবনামা",
        author: "Akhtaruzzaman Elias",
        image: coverKhoab,
        price: 294,
        mrp: 450,
        quantity: 1,
        format: "Hardcover",
    },
];

const COUNTRIES = [
    "India",
    "Bangladesh",
    "United States",
    "United Kingdom",
] as const;

const INDIAN_STATES = [
    "West Bengal",
    "Delhi NCR",
    "Maharashtra",
    "Karnataka",
] as const;

const BANGLADESH_DIVISIONS = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
] as const;

const INITIAL_BILLING: AddressDetails = {
    name: "Mohan Das",
    country: "India",
    state: "West Bengal",
    city: "Kolkata",
    address: "74/B College Street",
    flatNo: "Flat 4A",
    postcode: "713407",
    email: "gamersrohan@gmail.com",
    mobile: "6294561234",
};

const INITIAL_SHIPPING: AddressDetails = {
    name: "",
    country: "India",
    state: "West Bengal",
    city: "",
    address: "",
    flatNo: "",
    postcode: "",
    email: "",
    mobile: "",
};

const DELIVERY_CHARGE = 0;
const GST_CHARGE = 0;

const INPUT_BASE_CLASS =
    "h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent";

function FieldLabel({
    children,
    required = false,
}: FieldLabelProps) {
    return (
        <label className="mb-1 block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            {children}

            {required && (
                <span className="text-red-500">
                    {" "}
                    *
                </span>
            )}
        </label>
    );
}

function getStatesList(
    country: string,
): readonly string[] {
    return country === "Bangladesh"
        ? BANGLADESH_DIVISIONS
        : INDIAN_STATES;
}

export default function CheckoutPage() {
    const [billing, setBilling] =
        useState<AddressDetails>(
            INITIAL_BILLING,
        );

    const [sameAsBilling, setSameAsBilling] =
        useState(true);

    const [shipping, setShipping] =
        useState<AddressDetails>(
            INITIAL_SHIPPING,
        );

    const [
        paymentMethod,
        setPaymentMethod,
    ] =
        useState<PaymentMethod>("online");

    const [
        acceptedTerms,
        setAcceptedTerms,
    ] = useState(false);

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(false);

    const [
        isOrderComplete,
        setIsOrderComplete,
    ] = useState(false);

    const [orderNumber, setOrderNumber] =
        useState("");

    const [couponCode, setCouponCode] =
        useState("");

    const [
        appliedCoupon,
        setAppliedCoupon,
    ] = useState<string | null>(null);

    const [
        couponDiscount,
        setCouponDiscount,
    ] = useState(0);

    const subtotal = ORDER_ITEMS.reduce(
        (total, item) =>
            total +
            item.price * item.quantity,
        0,
    );

    const totalMrp = ORDER_ITEMS.reduce(
        (total, item) =>
            total +
            item.mrp * item.quantity,
        0,
    );

    const totalSavings = Math.max(
        0,
        totalMrp -
        subtotal +
        couponDiscount,
    );

    const finalTotal = Math.max(
        0,
        subtotal -
        couponDiscount +
        DELIVERY_CHARGE +
        GST_CHARGE,
    );

    const totalCartCount =
        ORDER_ITEMS.reduce(
            (total, item) =>
                total + item.quantity,
            0,
        );

    const handleBillingChange = (
        field: keyof AddressDetails,
        value: string,
    ): void => {
        setBilling((currentBilling) => ({
            ...currentBilling,
            [field]: value,
        }));
    };

    const handleShippingChange = (
        field: keyof AddressDetails,
        value: string,
    ): void => {
        setShipping(
            (currentShipping) => ({
                ...currentShipping,
                [field]: value,
            }),
        );
    };

    const handleApplyPromo = (
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
                Math.round(subtotal * 0.1);

            setCouponDiscount(discount);
            setAppliedCoupon(code);

            toast.success(
                `Coupon "${code}" applied! You saved ₹${discount}.00`,
            );

            return;
        }

        if (code === "BENGAL20") {
            const discount =
                Math.round(subtotal * 0.2);

            setCouponDiscount(discount);
            setAppliedCoupon(code);

            toast.success(
                `Coupon "${code}" applied! You saved ₹${discount}.00`,
            );

            return;
        }

        if (code === "BOI50") {
            setCouponDiscount(50);
            setAppliedCoupon(code);

            toast.success(
                `Coupon "${code}" applied! You saved ₹50.00`,
            );

            return;
        }

        toast.error(
            "Invalid coupon code. Try 'BENGAL10'",
        );
    };

    const handleRemovePromo =
        (): void => {
            setAppliedCoupon(null);
            setCouponDiscount(0);
            setCouponCode("");

            toast.info("Coupon removed");
        };

    const handleProceedToPayment =
        (): void => {
            if (
                !billing.name.trim() ||
                !billing.postcode.trim() ||
                !billing.mobile.trim()
            ) {
                toast.error(
                    "Please fill required billing details",
                );
                return;
            }

            if (
                !sameAsBilling &&
                (!shipping.name.trim() ||
                    !shipping.address.trim())
            ) {
                toast.error(
                    "Please fill required shipping details",
                );
                return;
            }

            if (!acceptedTerms) {
                toast.error(
                    "Please accept Terms & Conditions",
                );
                return;
            }

            setIsProcessing(true);

            window.setTimeout(() => {
                setIsProcessing(false);

                setOrderNumber(
                    `IBB-${Math.floor(
                        100000 +
                        Math.random() * 900000,
                    )}`,
                );

                setIsOrderComplete(true);
            }, 1200);
        };

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">


            <CategoryBanner
                categoryName=""
                compact
            />

            <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Checkout Progress */}
                    <div className="mx-auto mb-6 max-w-2xl rounded-lg border border-border bg-background p-3 shadow-xs">
                        <div className="flex items-center justify-between px-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5 text-emerald-600">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                                    ✓
                                </span>

                                Cart
                            </div>

                            <div className="h-px w-8 bg-emerald-500 sm:w-16" />

                            <div className="flex items-center gap-1.5 text-accent">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                                    2
                                </span>

                                Shipping
                            </div>

                            <div className="h-px w-8 bg-border sm:w-16" />

                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border">
                                    3
                                </span>

                                Payment
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
                        {/* Billing + Shipping */}
                        <div
                            className={`grid grid-cols-1 gap-5 lg:col-span-8 md:grid-cols-2 ${sameAsBilling
                                ? "items-start"
                                : "items-stretch"
                                }`}
                        >
                            {/* Billing Details */}
                            <section
                                className={`flex flex-col justify-between rounded-lg border border-border bg-surface p-5 shadow-xs ${!sameAsBilling
                                    ? "h-full"
                                    : ""
                                    }`}
                            >
                                <div>
                                    <h2 className="mb-4 border-b border-border pb-2 text-lg font-bold">
                                        Billing Details
                                    </h2>

                                    <div className="space-y-3">
                                        <div>
                                            <FieldLabel required>
                                                Full Name
                                            </FieldLabel>

                                            <input
                                                type="text"
                                                autoComplete="name"
                                                value={billing.name}
                                                onChange={(event) =>
                                                    handleBillingChange(
                                                        "name",
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                className={
                                                    INPUT_BASE_CLASS
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <FieldLabel required>
                                                    Country
                                                </FieldLabel>

                                                <div className="relative">
                                                    <select
                                                        value={
                                                            billing.country
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) => {
                                                            const country =
                                                                event
                                                                    .target
                                                                    .value;

                                                            handleBillingChange(
                                                                "country",
                                                                country,
                                                            );

                                                            handleBillingChange(
                                                                "state",
                                                                country ===
                                                                    "Bangladesh"
                                                                    ? "Dhaka"
                                                                    : "West Bengal",
                                                            );
                                                        }}
                                                        className={`${INPUT_BASE_CLASS} appearance-none pr-7`}
                                                    >
                                                        {COUNTRIES.map(
                                                            (
                                                                country,
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        country
                                                                    }
                                                                    value={
                                                                        country
                                                                    }
                                                                >
                                                                    {
                                                                        country
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    <ChevronDown
                                                        size={14}
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <FieldLabel required>
                                                    State
                                                </FieldLabel>

                                                <div className="relative">
                                                    <select
                                                        value={
                                                            billing.state
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleBillingChange(
                                                                "state",
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`${INPUT_BASE_CLASS} appearance-none pr-7`}
                                                    >
                                                        {getStatesList(
                                                            billing.country,
                                                        ).map(
                                                            (state) => (
                                                                <option
                                                                    key={state}
                                                                    value={state}
                                                                >
                                                                    {state}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    <ChevronDown
                                                        size={14}
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <FieldLabel required>
                                                    City
                                                </FieldLabel>

                                                <input
                                                    type="text"
                                                    autoComplete="address-level2"
                                                    value={
                                                        billing.city
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleBillingChange(
                                                            "city",
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    className={
                                                        INPUT_BASE_CLASS
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>
                                                    Postcode
                                                </FieldLabel>

                                                <input
                                                    type="text"
                                                    autoComplete="postal-code"
                                                    value={
                                                        billing.postcode
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleBillingChange(
                                                            "postcode",
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    className={`${INPUT_BASE_CLASS} font-mono`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel required>
                                                Address
                                            </FieldLabel>

                                            <input
                                                type="text"
                                                autoComplete="street-address"
                                                value={
                                                    billing.address
                                                }
                                                onChange={(event) =>
                                                    handleBillingChange(
                                                        "address",
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                placeholder="Street name"
                                                className={
                                                    INPUT_BASE_CLASS
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <FieldLabel>
                                                    Apt / Flat (Opt)
                                                </FieldLabel>

                                                <input
                                                    type="text"
                                                    value={
                                                        billing.flatNo
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleBillingChange(
                                                            "flatNo",
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    className={
                                                        INPUT_BASE_CLASS
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>
                                                    Mobile
                                                </FieldLabel>

                                                <input
                                                    type="tel"
                                                    autoComplete="tel"
                                                    value={
                                                        billing.mobile
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleBillingChange(
                                                            "mobile",
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    className={`${INPUT_BASE_CLASS} font-mono`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 border-t border-border pt-2">
                                    <label className="group flex h-6 cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                sameAsBilling
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setSameAsBilling(
                                                    event.target
                                                        .checked,
                                                )
                                            }
                                            className="h-3.5 w-3.5 cursor-pointer rounded accent-accent"
                                        />

                                        <span className="text-xs font-medium text-text-secondary">
                                            Shipping same as
                                            Billing
                                        </span>
                                    </label>
                                </div>
                            </section>

                            {/* Shipping Details */}
                            <section
                                className={`flex flex-col justify-between rounded-lg border bg-surface p-5 transition-all ${sameAsBilling
                                    ? "border-border opacity-90 shadow-xs"
                                    : "h-full border-accent shadow-md"
                                    }`}
                            >
                                <div>
                                    <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                                        <h2 className="text-lg font-bold">
                                            Shipping Details
                                        </h2>

                                        {sameAsBilling && (
                                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                                                Same
                                            </span>
                                        )}
                                    </div>

                                    {sameAsBilling ? (
                                        <div className="space-y-3">
                                            <div className="rounded-md border border-border bg-surface-soft p-3">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-accent">
                                                        {billing.name ||
                                                            "Recipient"}
                                                    </span>

                                                    <span className="text-[10px] font-bold text-muted-foreground">
                                                        {
                                                            billing.mobile
                                                        }
                                                    </span>
                                                </div>

                                                <p className="text-[11px] leading-relaxed text-text-secondary">
                                                    {billing.flatNo &&
                                                        `${billing.flatNo}, `}

                                                    {
                                                        billing.address
                                                    }
                                                    <br />

                                                    {billing.city},{" "}
                                                    {billing.state}{" "}
                                                    {
                                                        billing.postcode
                                                    }
                                                    <br />

                                                    {
                                                        billing.country
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSameAsBilling(
                                                        false,
                                                    );

                                                    setShipping({
                                                        ...billing,
                                                    });
                                                }}
                                                className="w-full cursor-pointer rounded-md border border-dashed border-border py-2 text-xs font-semibold text-text-secondary transition-all hover:border-accent hover:text-accent"
                                            >
                                                + Deliver to
                                                different address
                                            </button>

                                            <div className="flex items-start gap-2 rounded-md bg-blue-50/50 p-2.5 text-[11px] text-blue-600 dark:bg-blue-900/10 dark:text-blue-400">
                                                <Info
                                                    size={14}
                                                    aria-hidden="true"
                                                    className="mt-0.5 shrink-0"
                                                />

                                                <p>
                                                    Packages are
                                                    wrapped in
                                                    moisture-safe
                                                    sleeves and
                                                    dispatched
                                                    within 24h.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="animate-in space-y-3 fade-in">
                                            <div>
                                                <FieldLabel required>
                                                    Recipient Name
                                                </FieldLabel>

                                                <input
                                                    type="text"
                                                    value={
                                                        shipping.name
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleShippingChange(
                                                            "name",
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    className={
                                                        INPUT_BASE_CLASS
                                                    }
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <FieldLabel required>
                                                        Country
                                                    </FieldLabel>

                                                    <div className="relative">
                                                        <select
                                                            value={
                                                                shipping.country
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) => {
                                                                const country =
                                                                    event
                                                                        .target
                                                                        .value;

                                                                handleShippingChange(
                                                                    "country",
                                                                    country,
                                                                );

                                                                handleShippingChange(
                                                                    "state",
                                                                    country ===
                                                                        "Bangladesh"
                                                                        ? "Dhaka"
                                                                        : "West Bengal",
                                                                );
                                                            }}
                                                            className={`${INPUT_BASE_CLASS} appearance-none pr-7`}
                                                        >
                                                            {COUNTRIES.map(
                                                                (
                                                                    country,
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            country
                                                                        }
                                                                        value={
                                                                            country
                                                                        }
                                                                    >
                                                                        {
                                                                            country
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>

                                                        <ChevronDown
                                                            size={14}
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <FieldLabel required>
                                                        State
                                                    </FieldLabel>

                                                    <div className="relative">
                                                        <select
                                                            value={
                                                                shipping.state
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleShippingChange(
                                                                    "state",
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`${INPUT_BASE_CLASS} appearance-none pr-7`}
                                                        >
                                                            {getStatesList(
                                                                shipping.country,
                                                            ).map(
                                                                (
                                                                    state,
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            state
                                                                        }
                                                                        value={
                                                                            state
                                                                        }
                                                                    >
                                                                        {
                                                                            state
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>

                                                        <ChevronDown
                                                            size={14}
                                                            aria-hidden="true"
                                                            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <FieldLabel required>
                                                        City
                                                    </FieldLabel>

                                                    <input
                                                        type="text"
                                                        value={
                                                            shipping.city
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleShippingChange(
                                                                "city",
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className={
                                                            INPUT_BASE_CLASS
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <FieldLabel required>
                                                        Postcode
                                                    </FieldLabel>

                                                    <input
                                                        type="text"
                                                        value={
                                                            shipping.postcode
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleShippingChange(
                                                                "postcode",
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`${INPUT_BASE_CLASS} font-mono`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <FieldLabel required>
                                                    Address
                                                </FieldLabel>

                                                <input
                                                    type="text"
                                                    value={
                                                        shipping.address
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        handleShippingChange(
                                                            "address",
                                                            event.target
                                                                .value,
                                                        )
                                                    }
                                                    className={
                                                        INPUT_BASE_CLASS
                                                    }
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <FieldLabel>
                                                        Apt / Flat
                                                    </FieldLabel>

                                                    <input
                                                        type="text"
                                                        value={
                                                            shipping.flatNo
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleShippingChange(
                                                                "flatNo",
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className={
                                                            INPUT_BASE_CLASS
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <FieldLabel required>
                                                        Mobile
                                                    </FieldLabel>

                                                    <input
                                                        type="tel"
                                                        value={
                                                            shipping.mobile
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleShippingChange(
                                                                "mobile",
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        className={`${INPUT_BASE_CLASS} font-mono`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!sameAsBilling && (
                                    <div className="mt-3 flex h-6 items-center justify-between border-t border-border pt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSameAsBilling(
                                                    true,
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                                        >
                                            <Undo2
                                                size={13}
                                                aria-hidden="true"
                                                className="shrink-0"
                                            />

                                            <span>
                                                Revert to same as
                                                Billing
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Order Summary */}
                        <aside className="lg:sticky lg:top-20 lg:col-span-4">
                            <div className="rounded-lg border border-border bg-surface p-5 shadow-md">
                                <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                                    <h2 className="text-lg font-bold">
                                        Your Order
                                    </h2>

                                    <span className="rounded bg-surface-soft px-2 py-1 text-[10px] font-bold">
                                        {ORDER_ITEMS.length}{" "}
                                        items
                                    </span>
                                </div>

                                {/* Products */}
                                <div className="mb-4 max-h-[140px] space-y-2.5 overflow-y-auto pr-1">
                                    {ORDER_ITEMS.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-2.5"
                                            >
                                                <Image
                                                    src={
                                                        item.image
                                                    }
                                                    alt={`${item.title} cover`}
                                                    width={36}
                                                    height={48}
                                                    className="h-12 w-9 rounded border border-border object-cover shadow-xs"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-xs font-semibold">
                                                        {
                                                            item.title
                                                        }
                                                    </h3>

                                                    <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                                                        <span>
                                                            Qty:{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>

                                                        <span className="font-bold text-foreground">
                                                            ₹
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="space-y-1.5 border-t border-border pt-3 text-xs text-text-secondary">
                                    <div className="flex justify-between">
                                        <span>
                                            Subtotal
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {subtotal.toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>
                                            Delivery
                                        </span>

                                        <span className="text-emerald-600">
                                            Free
                                        </span>
                                    </div>

                                    {couponDiscount >
                                        0 && (
                                            <div className="flex justify-between font-semibold text-accent">
                                                <span>
                                                    Discount
                                                </span>

                                                <span>
                                                    -₹
                                                    {couponDiscount.toFixed(
                                                        2,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                    <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                                        <span className="text-sm font-bold text-foreground uppercase">
                                            Total
                                        </span>

                                        <span className="text-xl font-bold text-foreground">
                                            ₹
                                            {finalTotal.toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>

                                    {totalSavings > 0 && (
                                        <p className="pt-1 text-right text-[10px] font-semibold text-emerald-600">
                                            You save ₹
                                            {totalSavings.toFixed(
                                                2,
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* Promo */}
                                <form
                                    onSubmit={
                                        handleApplyPromo
                                    }
                                    className="mt-4 flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(event) =>
                                            setCouponCode(
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Promo (BENGAL10)"
                                        aria-label="Promo code"
                                        className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground uppercase outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                                    />

                                    <button
                                        type="submit"
                                        className="h-8 cursor-pointer rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                                    >
                                        Apply
                                    </button>
                                </form>

                                {appliedCoupon &&
                                    couponDiscount > 0 && (
                                        <div className="animate-in mt-2 flex items-center justify-between rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-800 fade-in slide-in-from-top-1 duration-200 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                                            <div className="flex items-center gap-1.5">
                                                <Tag
                                                    size={13}
                                                    aria-hidden="true"
                                                    className="shrink-0 text-emerald-600 dark:text-emerald-400"
                                                />

                                                <span className="font-bold tracking-wide uppercase">
                                                    {
                                                        appliedCoupon
                                                    }
                                                    :
                                                </span>

                                                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                                    Saved ₹
                                                    {couponDiscount.toFixed(
                                                        2,
                                                    )}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleRemovePromo
                                                }
                                                aria-label="Remove coupon"
                                                title="Remove coupon"
                                                className="cursor-pointer rounded-full p-1 text-emerald-800 transition-colors hover:bg-emerald-200/70 dark:text-emerald-200 dark:hover:bg-emerald-900"
                                            >
                                                <X
                                                    size={12}
                                                />
                                            </button>
                                        </div>
                                    )}

                                {/* Payment Method */}
                                <div className="mt-4 border-t border-border pt-4">
                                    <span className="mb-2 block text-[10px] font-bold text-muted-foreground uppercase">
                                        Payment Method
                                    </span>

                                    <div className="grid grid-cols-2 gap-2">
                                        <label
                                            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border p-2.5 transition-all ${paymentMethod ===
                                                "online"
                                                ? "border-accent bg-accent/5 text-accent"
                                                : "border-border text-text-secondary hover:bg-surface-soft"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                checked={
                                                    paymentMethod ===
                                                    "online"
                                                }
                                                onChange={() =>
                                                    setPaymentMethod(
                                                        "online",
                                                    )
                                                }
                                                className="sr-only"
                                            />

                                            <CreditCard
                                                size={18}
                                                aria-hidden="true"
                                            />

                                            <span className="text-[11px] font-bold uppercase">
                                                Online
                                            </span>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border p-2.5 transition-all ${paymentMethod ===
                                                "cod"
                                                ? "border-accent bg-accent/5 text-accent"
                                                : "border-border text-text-secondary hover:bg-surface-soft"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={
                                                    paymentMethod ===
                                                    "cod"
                                                }
                                                onChange={() =>
                                                    setPaymentMethod(
                                                        "cod",
                                                    )
                                                }
                                                className="sr-only"
                                            />

                                            <Banknote
                                                size={18}
                                                aria-hidden="true"
                                            />

                                            <span className="text-[11px] font-bold uppercase">
                                                COD
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Terms */}
                                <label className="mt-4 flex cursor-pointer items-start gap-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            acceptedTerms
                                        }
                                        onChange={(event) =>
                                            setAcceptedTerms(
                                                event.target
                                                    .checked,
                                            )
                                        }
                                        className="mt-0.5 h-3.5 w-3.5 rounded accent-accent"
                                    />

                                    <span className="text-[10px] font-bold text-foreground uppercase">
                                        I Accept the{" "}
                                        <a
                                            href="#"
                                            className="text-accent underline"
                                        >
                                            Terms &
                                            Conditions
                                        </a>
                                        *
                                    </span>
                                </label>

                                {/* Place Order */}
                                <button
                                    type="button"
                                    onClick={
                                        handleProceedToPayment
                                    }
                                    disabled={
                                        isProcessing
                                    }
                                    className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-accent text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-75"
                                >
                                    {isProcessing ? (
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <Lock
                                            size={14}
                                            aria-hidden="true"
                                        />
                                    )}

                                    {isProcessing
                                        ? "Processing..."
                                        : "Pay Now"}
                                </button>
                            </div>

                            {/* Assurance */}
                            <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg border border-border bg-surface-soft px-1 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase">
                                <div className="flex flex-col items-center gap-0.5">
                                    <ShieldCheck
                                        size={14}
                                    />

                                    <span>
                                        Genuine
                                    </span>
                                </div>

                                <div className="flex flex-col items-center gap-0.5 border-x border-border">
                                    <Truck
                                        size={14}
                                    />

                                    <span>
                                        Secure
                                    </span>
                                </div>

                                <div className="flex flex-col items-center gap-0.5">
                                    <RotateCcw
                                        size={14}
                                    />

                                    <span>
                                        Returns
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {isOrderComplete && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="order-confirmed-title"
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                >
                    <div className="animate-in w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center shadow-2xl zoom-in-95">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2
                                size={28}
                                aria-hidden="true"
                            />
                        </div>

                        <h3
                            id="order-confirmed-title"
                            className="text-xl font-bold"
                        >
                            Order Confirmed!
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Thank you for
                            ordering.
                        </p>

                        <div className="my-5 space-y-1.5 rounded-md border border-border bg-background p-3 text-left text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    ID:
                                </span>

                                <span className="font-bold">
                                    {orderNumber}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total:
                                </span>

                                <span className="font-bold">
                                    ₹
                                    {finalTotal.toFixed(
                                        2,
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Link
                                href="/"
                                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-accent text-xs font-bold text-white uppercase transition-colors hover:bg-accent-hover"
                            >
                                <ShoppingBag
                                    size={14}
                                />

                                Continue Exploring
                            </Link>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsOrderComplete(
                                        false,
                                    )
                                }
                                className="h-9 w-full cursor-pointer rounded-md text-xs font-bold text-text-secondary transition-colors hover:bg-surface-hover"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}