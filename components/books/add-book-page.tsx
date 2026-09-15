"use client";

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import { toast } from "sonner";

import AdminTopNav from "./components/AdminTopNav";
import { BookCanonicalFields } from "./components/book-canonical-fields";
import { BookMediaAside } from "./components/book-media-aside";
import { BookPricingFields } from "./components/book-pricing-fields";
import { IsbnSearchField } from "./components/isbn-search-field";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";

import { useIsbnLookup } from "@/features/books";
import { useDebounce } from "@/hooks/use-debounce";
import { resolveCoverUrl } from "@/lib/image-url";
import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  const [isbn, setIsbn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [language, setLanguage] = useState("en");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [pages, setPages] = useState("");
  const [edition, setEdition] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryName, setCountryName] = useState("");
  const [description, setDescription] = useState("");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

  // Debounced ISBN Lookup
  const debouncedIsbn = useDebounce(isbn.trim(), 400);
  const lastAutofilledIsbn = useRef<string | null>(null);

  const {
    data: lookupResponse,
    isLoading: isLookingUpIsbn,
    isFetching: isFetchingIsbn,
  } = useIsbnLookup(debouncedIsbn, debouncedIsbn.length >= 3);

  const canonicalBook = lookupResponse?.data;
  const isBookFound = Boolean(lookupResponse?.exists && canonicalBook);
  const isAlreadyListed = Boolean(lookupResponse?.alreadyListedBySeller);
  const isChecking = isLookingUpIsbn || isFetchingIsbn;

  // Autofill form when canonical book is found
  useEffect(() => {
    if (
      isBookFound &&
      canonicalBook &&
      lastAutofilledIsbn.current !== canonicalBook.isbn
    ) {
      lastAutofilledIsbn.current = canonicalBook.isbn;

      if (canonicalBook.title) setTitleEn(canonicalBook.title);
      if (canonicalBook.titleBn) setTitleBn(canonicalBook.titleBn);
      if (canonicalBook.publisher) {
        setPublisherId(canonicalBook.publisher._id);
        setPublisherName(canonicalBook.publisher.name);
      }
      if (canonicalBook.authors?.[0]) {
        setAuthorId(canonicalBook.authors[0]._id);
        setAuthorName(canonicalBook.authors[0].name);
      }
      if (canonicalBook.categories?.[0]) {
        setCategoryId(canonicalBook.categories[0]._id);
        setCategoryName(canonicalBook.categories[0].name);
      }
      if (canonicalBook.country) {
        setCountryId(canonicalBook.country._id);
        setCountryName(canonicalBook.country.name);
      }
      if (canonicalBook.description) setDescription(canonicalBook.description);
      if (canonicalBook.edition) setEdition(canonicalBook.edition);
      if (canonicalBook.pages) setPages(String(canonicalBook.pages));
      if (canonicalBook.searchTags && canonicalBook.searchTags.length > 0) {
        setSearchTag(canonicalBook.searchTags.join(", "));
      }
      if (canonicalBook.language) {
        const langLower = canonicalBook.language.toLowerCase();
        setLanguage(langLower === "bengali" || langLower === "bn" ? "bn" : "en");
      }
      if (canonicalBook.coverImage) {
        setCoverPreview(resolveCoverUrl(canonicalBook.coverImage));
      }
      if (canonicalBook.images && canonicalBook.images.length > 0) {
        setExtraPreviews(
          canonicalBook.images.map((img) => resolveCoverUrl(img)).slice(0, 3),
        );
      }

      toast.success(`Found book "${canonicalBook.title}" in catalog! Canonical data locked.`);
    }
  }, [isBookFound, canonicalBook]);

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleExtraImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setExtraPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    }
  };

  const handleReset = () => {
    setIsbn("");
    lastAutofilledIsbn.current = null;
    setTitleEn("");
    setTitleBn("");
    setPublisherId("");
    setPublisherName("");
    setLanguage("en");
    setCategoryId("");
    setCategoryName("");
    setAuthorId("");
    setAuthorName("");
    setSearchTag("");
    setPages("");
    setEdition("");
    setPrice("");
    setStock("");
    setCountryId("");
    setCountryName("");
    setDescription("");
    setCoverPreview(null);
    setExtraPreviews([]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!titleEn.trim()) {
      toast.error("English Title is required");
      return;
    }
    if (!titleBn.trim()) {
      toast.error("Bengali Title is required");
      return;
    }
    if (!publisherId) {
      toast.error("Please select a publisher");
      return;
    }
    if (!authorId) {
      toast.error("Please select an author");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!stock || Number(stock) < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    toast.success(`Book "${titleEn}" details recorded successfully!`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />
      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="add-book" />

          {/* Already listed warning banner */}
          {isAlreadyListed && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold">Notice:</span> You already have an active listing for this book. Updating this form will adjust your listing.
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
          >
            {/* Form Details */}
            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-8">
              <div className="mb-6 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="mb-1 text-lg font-semibold text-foreground">
                    Book Details
                  </h2>
                  {/* {isBookFound && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Lock size={12} />
                      Canonical Data Locked
                    </span>
                  )} */}
                </div>
                <p className="text-sm text-text-secondary">
                  {isBookFound
                    ? "Canonical catalog details are locked. Enter your selling price and inventory stock below."
                    : "Enter the ISBN to auto-lookup existing books or create a new entry."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ISBN with Real-time Status */}
                <IsbnSearchField
                  isbn={isbn}
                  onIsbnChange={setIsbn}
                  isChecking={isChecking}
                  isBookFound={isBookFound}
                  lookupResponse={lookupResponse}
                  debouncedIsbn={debouncedIsbn}
                />

                {/* Canonical Metadata Fields */}
                <BookCanonicalFields
                  isBookFound={isBookFound}
                  titleEn={titleEn}
                  onTitleEnChange={setTitleEn}
                  titleBn={titleBn}
                  onTitleBnChange={setTitleBn}
                  publisherId={publisherId}
                  publisherName={publisherName}
                  onPublisherChange={(id, name) => {
                    setPublisherId(id);
                    setPublisherName(name);
                  }}
                  language={language}
                  onLanguageChange={setLanguage}
                  categoryId={categoryId}
                  categoryName={categoryName}
                  onCategoryChange={(id, name) => {
                    setCategoryId(id);
                    setCategoryName(name);
                  }}
                  authorId={authorId}
                  authorName={authorName}
                  onAuthorChange={(id, name) => {
                    setAuthorId(id);
                    setAuthorName(name);
                  }}
                  countryId={countryId}
                  countryName={countryName}
                  onCountryChange={(id, name) => {
                    setCountryId(id);
                    setCountryName(name);
                  }}
                  edition={edition}
                  onEditionChange={setEdition}
                  pages={pages}
                  onPagesChange={setPages}
                  searchTag={searchTag}
                  onSearchTagChange={setSearchTag}
                  description={description}
                  onDescriptionChange={setDescription}
                />

                {/* Seller Pricing & Inventory (Always editable) */}
                <BookPricingFields
                  price={price}
                  onPriceChange={setPrice}
                  stock={stock}
                  onStockChange={setStock}
                />
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-11 flex-1 cursor-pointer rounded-md border-border bg-transparent text-foreground transition-colors hover:bg-surface-hover"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 flex-1 cursor-pointer rounded-md bg-accent font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
                >
                  Save Changes
                </Button>
              </div>
            </section>

            {/* Media Upload / Preview Aside */}
            <BookMediaAside
              isBookFound={isBookFound}
              coverPreview={coverPreview}
              onCoverChange={handleCoverChange}
              onCoverRemove={() => setCoverPreview(null)}
              extraPreviews={extraPreviews}
              onExtraImagesChange={handleExtraImagesChange}
              onExtraImageRemove={(idx) =>
                setExtraPreviews((prev) => prev.filter((_, i) => i !== idx))
              }
            />
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}