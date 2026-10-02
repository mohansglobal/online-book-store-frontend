// Hook managing add and edit book listing form state, pre-filling, and PATCH / API mutations
"use client";

import {
  useState,
  useCallback,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useBook,
  useCreateBookListingMutation,
  useUpdateListingMutation,
} from "@/features/books";
import { useCountries } from "@/features/countries";
import { uploadMultipleImages, uploadSingleImage } from "@/lib/api";
import { resolveCoverUrl } from "@/lib/image-url";
import {
  buildBookListingPayload,
  type AddBookFormState,
} from "../utils/add-book-payload";

export function useAddBookForm() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const editId = searchParams.get("id") || searchParams.get("listingId") || "";

  const [bookId, setBookId] = useState("");

  const [isbn, setIsbn] = useState("");

  const [titleEn, setTitleEn] = useState("");

  const [titleBn, setTitleBn] = useState("");

  const [publisherId, setPublisherId] = useState("");

  const [publisherName, setPublisherName] = useState("");

  const [language, setLanguage] = useState("bn");

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

  const { data: countriesData } = useCountries({ limit: 100 });

  const defaultCountry = countriesData?.data?.find(
    (c) => c.code === "IN" || c.name.toLowerCase() === "india",
  );

  const resolvedCountryId =
    countryId || defaultCountry?._id || defaultCountry?.code || "India";

  const resolvedCountryName =
    countryName || defaultCountry?.name || "India";

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [formKey, setFormKey] = useState(0);

  // Fetch listing data when editing from inventory
  const { data: listingResponse, isLoading: isLoadingListing } = useBook(editId);

  const isEditMode = Boolean(editId);

  // Prefill form fields when existing listing data arrives
  useEffect(() => {
    if (!listingResponse?.data) return;

    const item = listingResponse.data;

    const resolvedBookId = item.bookId || item._id;

    if (resolvedBookId) setBookId(resolvedBookId);

    if (item.isbn) setIsbn(item.isbn);

    if (item.title) setTitleEn(item.title);

    if (item.titleBn) setTitleBn(item.titleBn);

    if (item.publisher) {
      const pubId = typeof item.publisher === "object" ? item.publisher._id : item.publisher;

      const pubName = typeof item.publisher === "object" ? item.publisher.name : "";

      setPublisherId(pubId);

      if (pubName) setPublisherName(pubName);
    }

    if (item.authors?.[0]) {
      const a = item.authors[0];

      const aId = typeof a === "object" ? a._id : a;

      const aName = typeof a === "object" ? a.name : "";

      setAuthorId(aId);

      if (aName) setAuthorName(aName);
    }

    if (item.categories?.[0]) {
      const c = item.categories[0];

      const cId = typeof c === "object" ? c._id : c;

      const cName = typeof c === "object" ? c.name : "";

      setCategoryId(cId);

      if (cName) setCategoryName(cName);
    }

    if (item.country) {
      const ctry = item.country;

      const cId = typeof ctry === "object" ? ctry._id : ctry;

      const cName = typeof ctry === "object" ? ctry.name : "";

      setCountryId(cId);

      if (cName) setCountryName(cName);
    }

    if (item.language) {
      const isBengali =
        item.language.toLowerCase().includes("ben") ||
        item.language.toLowerCase() === "bn";

      setLanguage(isBengali ? "bn" : "en");
    }

    if (item.description) setDescription(item.description);

    if (item.edition) setEdition(item.edition);

    if (item.pages !== undefined && item.pages !== null) setPages(String(item.pages));

    if (Array.isArray(item.searchTags) && item.searchTags.length > 0) {
      setSearchTag(item.searchTags.join(", "));
    }

    if (item.mrpInPaise !== undefined && item.mrpInPaise !== null) {
      setMrp(String(item.mrpInPaise / 100));
    } else if (item.originalPrice !== undefined && item.originalPrice !== null) {
      const cleanMrp = String(item.originalPrice).replace(/[^0-9.]/g, "");

      setMrp(cleanMrp);
    } else if (item.priceIn !== undefined && item.priceIn !== null) {
      const cleanMrp = String(item.priceIn).replace(/[^0-9.]/g, "");

      setMrp(cleanMrp);
    } else if (item.price !== undefined && item.price !== null) {
      const cleanPrice = String(item.price).replace(/[^0-9.]/g, "");

      setMrp(cleanPrice);
    }

    if (item.sellingPriceInPaise !== undefined && item.sellingPriceInPaise !== null) {
      setSellingPrice(String(item.sellingPriceInPaise / 100));
    } else if (item.price !== undefined && item.price !== null) {
      const cleanPrice = String(item.price).replace(/[^0-9.]/g, "");

      setSellingPrice(cleanPrice);
    }

    if (item.stock !== undefined && item.stock !== null) {
      setStock(String(item.stock));
    }

    if (item.sku) setSku(item.sku);

    const resolvedCover = item.coverImage ? resolveCoverUrl(item.coverImage) : null;

    if (resolvedCover) {
      setCoverPreview(resolvedCover);
    }

    const rawListingImages = item.listingImages;

    const rawAllImages = item.images;

    let galleryImages: string[] = [];

    if (Array.isArray(rawListingImages) && rawListingImages.length > 0) {
      galleryImages = rawListingImages;
    } else if (Array.isArray(rawAllImages) && rawAllImages.length > 0) {
      galleryImages = rawAllImages.filter((img) => resolveCoverUrl(img) !== resolvedCover);
    }

    const resolvedGalleryUrls = galleryImages.map((img) => resolveCoverUrl(img));

    setExtraPreviews(resolvedGalleryUrls);
  }, [listingResponse]);

  const { mutate: createListing, isPending: isCreating } =
    useCreateBookListingMutation();

  const { mutate: updateListing, isPending: isUpdating } =
    useUpdateListingMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleCoverChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    event.target.value = "";

    const localUrl = URL.createObjectURL(file);

    setCoverPreview(localUrl);

    setIsUploadingCover(true);

    try {
      const res = await uploadSingleImage(file, "books/covers");

      const deployedUrl = res.data?.url || res.data?.urls?.[0];

      if (deployedUrl) {
        setCoverPreview(deployedUrl);

        toast.success("Cover image uploaded");
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

    event.target.value = "";

    setIsUploadingGallery(true);

    try {
      const res = await uploadMultipleImages(fileList, "books/gallery");

      const deployedUrls =
        res.data?.urls || (res.data?.url ? [res.data.url] : []);

      if (deployedUrls.length > 0) {
        setExtraPreviews((prev) => {
          const combined = [...prev, ...deployedUrls];

          const unique = Array.from(new Set(combined));

          return unique.slice(0, 4);
        });

        toast.success(`${deployedUrls.length} gallery image(s) uploaded.`);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload gallery images";

      toast.error(message);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleReset = useCallback(() => {
    setBookId("");

    setIsbn("");

    setTitleEn("");

    setTitleBn("");

    setPublisherId("");

    setPublisherName("");

    setLanguage("bn");

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

    setFormKey((prev) => prev + 1);

    if (editId) {
      router.push("/inventory");
    }
  }, [editId, router]);

  const getFormState = (): AddBookFormState => ({
    bookId,
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
    countryId: resolvedCountryId,
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

    const payload = buildBookListingPayload(formState);

    if (isEditMode) {
      updateListing(
        {
          listingId: editId,
          mrp: parsedMrp,
          sellingPrice: parsedSelling,
          stock: parsedStock,
          sku: sku.trim() || undefined,
          title: titleEn.trim(),
          titleBn: titleBn.trim(),
          isbn: isbn.trim() || undefined,
          description: description.trim() || undefined,
          authors: authorId ? [authorId] : undefined,
          publisher: publisherId || undefined,
          categories: categoryId ? [categoryId] : undefined,
          language: language === "bn" ? "Bengali" : "English",
          edition: edition.trim() || undefined,
          pages: pages ? parseInt(pages, 10) || undefined : undefined,
          coverImage: coverPreview || undefined,
          listingImages: extraPreviews.length > 0 ? extraPreviews : undefined,
        },
        {
          onSuccess: (res) => {
            toast.success(
              res.message || `Listing for "${titleEn}" updated successfully!`,
            );

            router.push("/inventory");
          },
          onError: (err) => {
            toast.error(err.message || "Failed to update listing");
          },
        },
      );
    } else {
      createListing(payload, {
        onSuccess: (res) => {
          toast.success(
            res.message || `Book "${titleEn}" and listing created successfully!`,
          );

          router.push("/inventory");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create book listing");
        },
      });
    }
  };

  return {
    isEditMode,
    isLoadingListing,
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
    countryId: resolvedCountryId,
    setCountryId,
    countryName: resolvedCountryName,
    setCountryName,
    description,
    setDescription,
    coverPreview,
    setCoverPreview,
    extraPreviews,
    setExtraPreviews,
    isUploadingCover,
    isUploadingGallery,
    isSubmitting,
    formKey,
    handleCoverChange,
    handleExtraImagesChange,
    handleReset,
    handleSubmit,
  };
}
