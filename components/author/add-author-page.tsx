// Admin Add & Edit Author page client coordinator component
"use client";

import AdminTopNav from "@/components/books/components/AdminTopNav";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";
import { AuthorForm } from "./components/author-form";
import { RecentAuthorsList } from "./components/recent-authors-list";
import { useAddAuthorForm } from "./hooks/use-add-author-form";

export default function AddAuthorPage() {
  const {
    name,
    setName,
    nameBn,
    setNameBn,
    bio,
    setBio,
    photo,
    photoPreview,
    birthDate,
    setBirthDate,
    deathDate,
    setDeathDate,
    isActive,
    setIsActive,
    isUploadingPhoto,
    isCropModalOpen,
    cropImageSrc,
    isSubmitting,
    isEditing,
    formErrors,
    handleSelectAuthorForEdit,
    handleCancelEdit,
    handlePhotoFileChange,
    handleCropComplete,
    handleCloseCropModal,
    handleRemovePhoto,
    handleReset,
    handleSubmit,
  } = useAddAuthorForm();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />
      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="add-author" />

          {/* Side-by-side grid: Author Form (Add / Edit) on left, Recent Authors on right */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <AuthorForm
                name={name}
                onNameChange={setName}
                nameBn={nameBn}
                onNameBnChange={setNameBn}
                bio={bio}
                onBioChange={setBio}
                photo={photo}
                photoPreview={photoPreview}
                onPhotoFileChange={handlePhotoFileChange}
                onRemovePhoto={handleRemovePhoto}
                isUploadingPhoto={isUploadingPhoto}
                isCropModalOpen={isCropModalOpen}
                cropImageSrc={cropImageSrc}
                onCropComplete={handleCropComplete}
                onCloseCropModal={handleCloseCropModal}
                birthDate={birthDate}
                onBirthDateChange={setBirthDate}
                deathDate={deathDate}
                onDeathDateChange={setDeathDate}
                isActive={isActive}
                onIsActiveChange={setIsActive}
                isSubmitting={isSubmitting}
                isEditing={isEditing}
                formErrors={formErrors}
                onReset={handleReset}
                onCancelEdit={handleCancelEdit}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="lg:col-span-5">
              <RecentAuthorsList onEditAuthor={handleSelectAuthorForEdit} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
