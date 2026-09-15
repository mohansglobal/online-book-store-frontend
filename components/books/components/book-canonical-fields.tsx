"use client";

import { Lock } from "lucide-react";
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
import { AuthorSelect } from "./author-select";
import { CategorySelect } from "./category-select";
import { CountrySelect } from "./country-select";
import { PublisherSelect } from "./publisher-select";

interface BookCanonicalFieldsProps {
  isBookFound: boolean;
  titleEn: string;
  onTitleEnChange: (value: string) => void;
  titleBn: string;
  onTitleBnChange: (value: string) => void;
  publisherId: string;
  publisherName: string;
  onPublisherChange: (id: string, name: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  categoryId: string;
  categoryName: string;
  onCategoryChange: (id: string, name: string) => void;
  authorId: string;
  authorName: string;
  onAuthorChange: (id: string, name: string) => void;
  countryId: string;
  countryName: string;
  onCountryChange: (id: string, name: string) => void;
  edition: string;
  onEditionChange: (value: string) => void;
  pages: string;
  onPagesChange: (value: string) => void;
  searchTag: string;
  onSearchTagChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1";

const INPUT_CLASS =
  "h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:bg-surface-soft/80 disabled:text-muted-foreground disabled:opacity-75 disabled:border-border/60";

const SELECT_TRIGGER_CLASS =
  "h-10 cursor-pointer rounded-md border-border bg-background text-foreground focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:bg-surface-soft/80 disabled:text-muted-foreground disabled:opacity-75 disabled:border-border/60";

const SELECT_CONTENT_CLASS = "border-border bg-surface text-foreground";

export function BookCanonicalFields({
  isBookFound,
  titleEn,
  onTitleEnChange,
  titleBn,
  onTitleBnChange,
  publisherId,
  publisherName,
  onPublisherChange,
  language,
  onLanguageChange,
  categoryId,
  categoryName,
  onCategoryChange,
  authorId,
  authorName,
  onAuthorChange,
  countryId,
  countryName,
  onCountryChange,
  edition,
  onEditionChange,
  pages,
  onPagesChange,
  searchTag,
  onSearchTagChange,
  description,
  onDescriptionChange,
}: BookCanonicalFieldsProps) {
  return (
    <>
      {/* English Title */}
      <div className="space-y-2">
        <Label htmlFor="titleEn" className={LABEL_CLASS}>
          <span>Title (EN)</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Input
          id="titleEn"
          required
          disabled={isBookFound}
          value={titleEn}
          onChange={(e) => onTitleEnChange(e.target.value)}
          placeholder="Book Title in English"
          className={INPUT_CLASS}
        />
      </div>

      {/* Bengali Title */}
      <div className="space-y-2">
        <Label htmlFor="titleBn" className={LABEL_CLASS}>
          <span>Title (BN)</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Input
          id="titleBn"
          required
          disabled={isBookFound}
          value={titleBn}
          onChange={(e) => onTitleBnChange(e.target.value)}
          placeholder="Book Title in Bengali"
          className={INPUT_CLASS}
        />
      </div>

      {/* Publisher (Searchable Dropdown) */}
      <div className="space-y-2">
        <Label htmlFor="publisher" className={LABEL_CLASS}>
          <span>Publisher</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <PublisherSelect
          id="publisher"
          value={publisherId}
          selectedLabel={publisherName}
          onChange={(id, pub) => onPublisherChange(id, pub?.name || "")}
          disabled={isBookFound}
          required
        />
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language" className={LABEL_CLASS}>
          <span>Language</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Select
          value={language}
          onValueChange={onLanguageChange}
          disabled={isBookFound}
        >
          <SelectTrigger
            id="language"
            disabled={isBookFound}
            className={SELECT_TRIGGER_CLASS}
          >
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className={SELECT_CONTENT_CLASS}>
            <SelectItem value="en" className="cursor-pointer">
              English
            </SelectItem>
            <SelectItem value="bn" className="cursor-pointer">
              Bengali
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category (Searchable Dropdown) */}
      <div className="space-y-2">
        <Label htmlFor="category" className={LABEL_CLASS}>
          <span>Select Category</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <CategorySelect
          id="category"
          value={categoryId}
          selectedLabel={categoryName}
          onChange={(id, cat) => onCategoryChange(id, cat?.name || "")}
          disabled={isBookFound}
          required
        />
      </div>

      {/* Author (Searchable Dropdown) */}
      <div className="space-y-2">
        <Label htmlFor="author" className={LABEL_CLASS}>
          <span>Author</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <AuthorSelect
          id="author"
          value={authorId}
          selectedLabel={authorName}
          onChange={(id, aut) => onAuthorChange(id, aut?.name || "")}
          disabled={isBookFound}
          required
        />
      </div>

      {/* Country (Searchable Dropdown) */}
      <div className="space-y-2">
        <Label htmlFor="country" className={LABEL_CLASS}>
          <span>Check Country</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <CountrySelect
          id="country"
          value={countryId}
          selectedLabel={countryName}
          onChange={(id, ctry) => onCountryChange(id, ctry?.name || "")}
          disabled={isBookFound}
          required
        />
      </div>

      {/* Edition */}
      <div className="space-y-2">
        <Label htmlFor="edition" className={LABEL_CLASS}>
          <span>Edition</span>
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Input
          id="edition"
          disabled={isBookFound}
          value={edition}
          onChange={(e) => onEditionChange(e.target.value)}
          placeholder="1st Edition"
          className={INPUT_CLASS}
        />
      </div>

      {/* Pages */}
      <div className="space-y-2">
        <Label htmlFor="pages" className={LABEL_CLASS}>
          <span>No of Page</span>
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Input
          id="pages"
          type="number"
          min={0}
          disabled={isBookFound}
          value={pages}
          onChange={(e) => onPagesChange(e.target.value)}
          placeholder="0"
          className={INPUT_CLASS}
        />
      </div>

      {/* Search Tag */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="searchTag" className={LABEL_CLASS}>
          <span>Search Tag</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Input
          id="searchTag"
          required
          disabled={isBookFound}
          value={searchTag}
          onChange={(e) => onSearchTagChange(e.target.value)}
          placeholder="e.g. romance, thriller, islamic"
          className={INPUT_CLASS}
        />
      </div>

      {/* Description */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description" className={LABEL_CLASS}>
          <span>Description</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
        </Label>
        <Textarea
          id="description"
          required
          disabled={isBookFound}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Write a brief description about the book..."
          className="min-h-[120px] resize-none rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:bg-surface-soft/80 disabled:text-muted-foreground disabled:opacity-75 disabled:border-border/60"
        />
      </div>
    </>
  );
}
