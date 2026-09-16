"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import AdminTopNav from "./components/AdminTopNav";
import { BookCanonicalFields } from "./components/book-canonical-fields";
import { BookMediaAside } from "./components/book-media-aside";
import { BookPricingFields } from "./components/book-pricing-fields";
import { IsbnSearchField } from "./components/isbn-search-field";
import { useAddBookForm } from "./hooks/use-add-book-form";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";
import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  const {
    isbn,
    setIsbn,
    titleEn,
    setTitleEn,
    titleBn,
    setTitleBn,
    publisherId,
    setPublisherId,
    publisherName,
    setPublisherName,
    language,
    setLanguage,
    categoryId,
    setCategoryId,
    categoryName,
    setCategoryName,
    authorId,
    setAuthorId,
    authorName,
    setAuthorName,
    searchTag,
    setSearchTag,
    pages,
    setPages,
    edition,
    setEdition,
    mrp,
    setMrp,
    sellingPrice,
    setSellingPrice,
    stock,
    setStock,
    sku,
    setSku,
    countryId,
    setCountryId,
    countryName,
    setCountryName,
    description,
    setDescription,
    coverPreview,
    setCoverPreview,
    extraPreviews,
    setExtraPreviews,
    isUploadingCover,
    isUploadingGallery,
    debouncedIsbn,
    lookupResponse,
    isBookFound,
    isAlreadyListed,
    isChecking,
    isSubmitting,
    handleCoverChange,
    handleExtraImagesChange,
    handleReset,
    handleSubmit,
  } = useAddBookForm();

  const isFormBusy = isSubmitting || isUploadingCover || isUploadingGallery;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />
      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="add-book" />

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
            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-8">
              <div className="mb-6 border-b border-border pb-4">
                <h2 className="mb-1 text-lg font-semibold text-foreground">
                  Book Details
                </h2>
                <p className="text-sm text-text-secondary">
                  {isBookFound
                    ? "Canonical catalog details are locked. Enter your selling price and inventory stock below."
                    : "Enter the ISBN to auto-lookup existing books or create a new entry."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <IsbnSearchField
                  isbn={isbn}
                  onIsbnChange={setIsbn}
                  isChecking={isChecking}
                  isBookFound={isBookFound}
                  lookupResponse={lookupResponse}
                  debouncedIsbn={debouncedIsbn}
                />

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

                <BookPricingFields
                  isBookFound={isBookFound}
                  mrp={mrp}
                  onMrpChange={setMrp}
                  sellingPrice={sellingPrice}
                  onSellingPriceChange={setSellingPrice}
                  stock={stock}
                  onStockChange={setStock}
                  sku={sku}
                  onSkuChange={setSku}
                />
              </div>

              <div className="mt-8 flex gap-4 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isFormBusy}
                  className="h-11 flex-1 cursor-pointer rounded-md border-border bg-transparent text-foreground transition-colors hover:bg-surface-hover disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isFormBusy}
                  className="h-11 flex-1 cursor-pointer rounded-md bg-accent font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Listing...
                    </span>
                  ) : isUploadingCover || isUploadingGallery ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading Images...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </section>

            <BookMediaAside
              isBookFound={isBookFound}
              coverPreview={coverPreview}
              isUploadingCover={isUploadingCover}
              onCoverChange={handleCoverChange}
              onCoverRemove={() => setCoverPreview(null)}
              extraPreviews={extraPreviews}
              isUploadingGallery={isUploadingGallery}
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