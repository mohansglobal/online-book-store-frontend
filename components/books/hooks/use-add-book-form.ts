"use client";

import { useState, useCallback, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { useCreateBookListingMutation } from "@/features/books";
import { uploadMultipleImages, uploadSingleImage } from "@/lib/api";
import { useIsbnAutofill } from "./use-isbn-autofill";
import {
  buildExistingBookPayload,
  buildNewBookPayload,
  type AddBookFormState,
} from "../utils/add-book-payload";

export function useAddBookForm() {
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
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryName, setCountryName] = useState("");
  const [description, setDescription] = useState("");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const setPublisher = useCallback((id: string, name: string) => {
    setPublisherId(id);
    setPublisherName(name);
  }, []);

  const setAuthor = useCallback((id: string, name: string) => {
    setAuthorId(id);
    setAuthorName(name);
  }, []);

  const setCategory = useCallback((id: string, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
  }, []);

  const setCountry = useCallback((id: string, name: string) => {
    setCountryId(id);
    setCountryName(name);
  }, []);

  const {
    debouncedIsbn,
    lookupResponse,
    canonicalBook,
    isBookFound,
    isAlreadyListed,
    isChecking,
    clearAutofillRef,
  } = useIsbnAutofill(isbn, {
    setTitleEn,
    setTitleBn,
    setPublisher,
    setAuthor,
    setCategory,
    setCountry,
    setDescription,
    setEdition,
    setPages,
    setSearchTag,
    setLanguage,
    setCoverPreview,
    setExtraPreviews,
    setMrp,
  });

  const { mutate: createListing, isPending: isSubmitting } =
    useCreateBookListingMutation();

  const handleCoverChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setCoverPreview(localUrl);
    setIsUploadingCover(true);

    try {
      const res = await uploadSingleImage(file, "books/covers");
      const deployedUrl = res.data?.url || res.data?.urls?.[0];

      if (deployedUrl) {
        setCoverPreview(deployedUrl);
        toast.success("Cover image uploaded to Cloudinary!");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload cover image";
      toast.error(message);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleExtraImagesChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxAllowed = 4 - extraPreviews.length;
    const fileList = Array.from(files).slice(0, maxAllowed);
    if (fileList.length === 0) return;

    setIsUploadingGallery(true);

    try {
      const res = await uploadMultipleImages(fileList, "books/gallery");
      const deployedUrls =
        res.data?.urls || (res.data?.url ? [res.data.url] : []);

      if (deployedUrls.length > 0) {
        setExtraPreviews((prev) => [...prev, ...deployedUrls].slice(0, 4));
        toast.success(
          `${deployedUrls.length} gallery image(s) uploaded to Cloudinary!`,
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload gallery images";
      toast.error(message);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleReset = () => {
    setIsbn("");
    clearAutofillRef();
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
    setMrp("");
    setSellingPrice("");
    setStock("");
    setSku("");
    setCountryId("");
    setCountryName("");
    setDescription("");
    setCoverPreview(null);
    setExtraPreviews([]);
  };

  const getFormState = (): AddBookFormState => ({
    isbn,
    titleEn,
    titleBn,
    publisherId,
    language,
    categoryId,
    authorId,
    searchTag,
    pages,
    edition,
    mrp,
    sellingPrice,
    stock,
    sku,
    countryId,
    description,
    coverPreview,
    extraPreviews,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (isUploadingCover || isUploadingGallery) {
      toast.warning("Please wait for image uploads to complete.");
      return;
    }

    const parsedMrp = parseFloat(mrp);
    if (!mrp || isNaN(parsedMrp) || parsedMrp <= 0) {
      toast.error("Please enter a valid MRP price");
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (stock === "" || isNaN(parsedStock) || parsedStock < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    const parsedSelling = sellingPrice ? parseFloat(sellingPrice) : parsedMrp;
    if (isNaN(parsedSelling) || parsedSelling <= 0) {
      toast.error("Please enter a valid selling price");
      return;
    }

    const formState = getFormState();

    if (isBookFound && canonicalBook) {
      const payload = buildExistingBookPayload(canonicalBook, formState);

      createListing(payload, {
        onSuccess: (res) => {
          toast.success(
            res.message ||
              `Listing for "${canonicalBook.title}" created successfully!`,
          );
          handleReset();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create book listing");
        },
      });
      return;
    }

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

    const payload = buildNewBookPayload(formState);

    createListing(payload, {
      onSuccess: (res) => {
        toast.success(
          res.message || `Book "${titleEn}" and listing created successfully!`,
        );
        handleReset();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create book listing");
      },
    });
  };

  return {
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
  };
}
