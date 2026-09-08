import {
    Book,
    Image as ImageIcon,
    IndianRupee,
    Plus,
} from "lucide-react";

import AdminTopNav from "./components/AdminTopNav";
import { CategoryBanner } from "../categories/components/CategoryBanner";
// import {
//     Footer,
//     Navbar,
// } from "@/components/home/components";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LABEL_CLASS_NAME =
    "text-xs font-semibold uppercase tracking-wider text-text-secondary";

const INPUT_CLASS_NAME =
    "h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent";

const SELECT_TRIGGER_CLASS_NAME =
    "h-10 cursor-pointer rounded-md border-border bg-background text-foreground focus:ring-1 focus:ring-accent";

const SELECT_CONTENT_CLASS_NAME =
    "border-border bg-surface text-foreground";

export default function AddBookPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">

            <CategoryBanner
                categoryName=""
                compact
            />

            <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <AdminTopNav activeTab="add-book" />

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Form */}
                        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-8">
                            <div className="mb-6 border-b border-border pb-4">
                                <h2 className="mb-1 text-lg font-semibold text-foreground">
                                    Book Details
                                </h2>

                                <p className="text-sm text-text-secondary">
                                    Enter the comprehensive details of the
                                    book.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* ISBN */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="isbn"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        I.S.B.N Code
                                    </Label>

                                    <Input
                                        id="isbn"
                                        name="isbn"
                                        placeholder="e.g. 978-3-16-148410-0"
                                        className={INPUT_CLASS_NAME}
                                    />
                                </div>

                                {/* English Title */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="titleEn"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Title (EN){" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Input
                                        id="titleEn"
                                        name="titleEn"
                                        required
                                        placeholder="Book Title in English"
                                        className={INPUT_CLASS_NAME}
                                    />
                                </div>

                                {/* Bengali Title */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="titleBn"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Title (BN){" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Input
                                        id="titleBn"
                                        name="titleBn"
                                        required
                                        placeholder="Book Title in Bengali"
                                        className={INPUT_CLASS_NAME}
                                    />
                                </div>

                                {/* Publisher */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="publisher"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Publisher{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Select>
                                        <SelectTrigger
                                            id="publisher"
                                            className={SELECT_TRIGGER_CLASS_NAME}
                                        >
                                            <SelectValue placeholder="Publisher" />
                                        </SelectTrigger>

                                        <SelectContent
                                            className={SELECT_CONTENT_CLASS_NAME}
                                        >
                                            <SelectItem
                                                value="pub1"
                                                className="cursor-pointer"
                                            >
                                                Publisher 1
                                            </SelectItem>

                                            <SelectItem
                                                value="pub2"
                                                className="cursor-pointer"
                                            >
                                                Publisher 2
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Language */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="language"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Language{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Select>
                                        <SelectTrigger
                                            id="language"
                                            className={SELECT_TRIGGER_CLASS_NAME}
                                        >
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>

                                        <SelectContent
                                            className={SELECT_CONTENT_CLASS_NAME}
                                        >
                                            <SelectItem
                                                value="en"
                                                className="cursor-pointer"
                                            >
                                                English
                                            </SelectItem>

                                            <SelectItem
                                                value="bn"
                                                className="cursor-pointer"
                                            >
                                                Bengali
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="category"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Select Category{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Select>
                                        <SelectTrigger
                                            id="category"
                                            className={SELECT_TRIGGER_CLASS_NAME}
                                        >
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>

                                        <SelectContent
                                            className={SELECT_CONTENT_CLASS_NAME}
                                        >
                                            <SelectItem
                                                value="fiction"
                                                className="cursor-pointer"
                                            >
                                                Fiction
                                            </SelectItem>

                                            <SelectItem
                                                value="nonfiction"
                                                className="cursor-pointer"
                                            >
                                                Non-Fiction
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Author */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="author"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Author{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Select>
                                        <SelectTrigger
                                            id="author"
                                            className={SELECT_TRIGGER_CLASS_NAME}
                                        >
                                            <SelectValue placeholder="Author" />
                                        </SelectTrigger>

                                        <SelectContent
                                            className={SELECT_CONTENT_CLASS_NAME}
                                        >
                                            <SelectItem
                                                value="auth1"
                                                className="cursor-pointer"
                                            >
                                                Author 1
                                            </SelectItem>

                                            <SelectItem
                                                value="auth2"
                                                className="cursor-pointer"
                                            >
                                                Author 2
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search Tag */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label
                                        htmlFor="searchTag"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Search Tag{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Input
                                        id="searchTag"
                                        name="searchTag"
                                        required
                                        placeholder="e.g. romance, thriller, basic"
                                        className={INPUT_CLASS_NAME}
                                    />
                                </div>

                                {/* Pages */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="pages"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        No of Page
                                    </Label>

                                    <Input
                                        id="pages"
                                        name="pages"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        className={INPUT_CLASS_NAME}
                                    />
                                </div>

                                {/* Edition */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="edition"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Edition
                                    </Label>

                                    <Input
                                        id="edition"
                                        name="edition"
                                        placeholder="1st Edition"
                                        className={INPUT_CLASS_NAME}
                                    />
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="price"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Price (MRP){" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <div className="relative">
                                        <IndianRupee
                                            aria-hidden="true"
                                            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                        />

                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            required
                                            min={0}
                                            step="0.01"
                                            placeholder="0.00"
                                            className={`${INPUT_CLASS_NAME} pl-9 font-sans tabular-nums`}
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="stock"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Stock{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        required
                                        min={0}
                                        placeholder="0"
                                        className={`${INPUT_CLASS_NAME} font-sans tabular-nums`}
                                    />
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="country"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Check Country{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Select>
                                        <SelectTrigger
                                            id="country"
                                            className={SELECT_TRIGGER_CLASS_NAME}
                                        >
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>

                                        <SelectContent
                                            className={SELECT_CONTENT_CLASS_NAME}
                                        >
                                            <SelectItem
                                                value="bd"
                                                className="cursor-pointer"
                                            >
                                                Bangladesh
                                            </SelectItem>

                                            <SelectItem
                                                value="in"
                                                className="cursor-pointer"
                                            >
                                                India
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label
                                        htmlFor="description"
                                        className={LABEL_CLASS_NAME}
                                    >
                                        Description{" "}
                                        <span className="text-accent">*</span>
                                    </Label>

                                    <Textarea
                                        id="description"
                                        name="description"
                                        required
                                        placeholder="Write a brief description about the book..."
                                        className="min-h-[120px] resize-none rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex gap-4 border-t border-border pt-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 flex-1 cursor-pointer rounded-md border-border bg-transparent text-foreground transition-colors hover:bg-surface-hover"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    className="h-11 flex-1 cursor-pointer rounded-md bg-accent font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </section>

                        {/* Cover Upload */}
                        <aside className="sticky top-24 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-4">
                            <div className="mb-6 border-b border-border pb-4">
                                <h2 className="mb-1 text-lg font-semibold text-foreground">
                                    Cover Image
                                </h2>

                                <p className="text-sm text-text-secondary">
                                    Upload the primary book cover.
                                </p>
                            </div>

                            {/* Upload Area */}
                            <div className="group relative mb-6 flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface-soft p-6 text-center transition-colors hover:border-accent">
                                <div className="mb-4 rounded-xl border border-border bg-surface p-4 shadow-xs">
                                    <Book className="h-8 w-8 text-muted-foreground" />
                                </div>

                                <p className="text-sm font-medium text-foreground">
                                    Upload your cover, or{" "}
                                    <span className="font-semibold text-accent underline">
                                        browse
                                    </span>
                                </p>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    Supports JPG, PNG, WEBP (Max 5MB)
                                </p>

                                <input
                                    type="file"
                                    name="cover"
                                    accept="image/jpeg,image/png,image/webp"
                                    aria-label="Upload book cover"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                />
                            </div>

                            {/* Additional Images */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-surface-soft">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground opacity-60" />
                                </div>

                                <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-surface-soft">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground opacity-60" />
                                </div>

                                <button
                                    type="button"
                                    aria-label="Add another book image"
                                    className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-surface-soft transition-colors hover:border-accent hover:bg-surface-hover"
                                >
                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>


        </div>
    );
}