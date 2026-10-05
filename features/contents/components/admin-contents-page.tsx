"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import { AdminTopNav } from "@/components/books/components/AdminTopNav";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";
import { Button } from "@/components/ui/button";
import { SECTION_LABELS } from "../constants/content.constants";
import {
  useSiteContent,
  useSiteContentAdmin,
} from "../hooks/use-site-content";
import type {
  AnnouncementContent,
  ContentSectionId,
  EbooksContent,
  HeroContent,
  NewsletterContent,
  PoetryContent,
} from "../types/content.types";
import { AnnouncementContentForm } from "./announcement-content-form";
import { ContentPreviewPane } from "./content-preview-pane";
import { ContentSectionNav } from "./content-section-nav";
import { EbooksContentForm } from "./ebooks-content-form";
import { HeroContentForm } from "./hero-content-form";
import { NewsletterContentForm } from "./newsletter-content-form";
import { PoetryContentForm } from "./poetry-content-form";

export function AdminContentsPage() {
  const { data: remoteResponse, isLoading, error } = useSiteContent();
  const { updateSectionMutation, resetMutation, isSaving } = useSiteContentAdmin();

  const [activeSection, setActiveSection] = useState<ContentSectionId>("hero");
  const [resetCounter, setResetCounter] = useState(0);

  const serverContent = remoteResponse?.data;

  // Local draft overrides for real-time live preview as user types
  const [draftOverrides, setDraftOverrides] = useState<{
    hero?: HeroContent;
    ebooks?: EbooksContent;
    poetry?: PoetryContent;
    announcement?: AnnouncementContent;
    newsletter?: NewsletterContent;
  }>({});

  const previewHero = draftOverrides.hero ?? serverContent?.hero;
  const previewEbooks = draftOverrides.ebooks ?? serverContent?.ebooks;
  const previewPoetry = draftOverrides.poetry ?? serverContent?.poetry;
  const previewAnnouncement = draftOverrides.announcement ?? serverContent?.announcement;
  const previewNewsletter = draftOverrides.newsletter ?? serverContent?.newsletter;

  // Single unified section save handler
  const handleSaveSection = async (
    section: ContentSectionId,
    data:
      | HeroContent
      | EbooksContent
      | PoetryContent
      | AnnouncementContent
      | NewsletterContent,
  ) => {
    try {
      await updateSectionMutation.mutateAsync({ section, data });

      setDraftOverrides((prev) => ({
        ...prev,
        [section]: undefined,
      }));

      toast.success(`${SECTION_LABELS[section]} content saved to database successfully!`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save section content";

      toast.error(errorMsg);
    }
  };

  // Single unified section reset handler (resets to backend defaults in MongoDB)
  const handleResetCurrentSection = async () => {
    try {
      await resetMutation.mutateAsync(activeSection);

      setDraftOverrides((prev) => ({
        ...prev,
        [activeSection]: undefined,
      }));

      setResetCounter((prev) => prev + 1);

      toast.info(`${SECTION_LABELS[activeSection]} restored to defaults`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to reset section";

      toast.error(errorMsg);
    }
  };

  // Reset all sections handler
  const handleResetAllSections = async () => {
    try {
      await resetMutation.mutateAsync();

      setDraftOverrides({});

      setResetCounter((prev) => prev + 1);

      toast.info("All site sections restored to defaults in database");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to reset sections";

      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="contents" />

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className=" text-2xl font-semibold tracking-tight text-foreground">
                Content Management
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Customize user-facing headlines, hero texts, rotating words, digital editions, and announcements with real-time preview.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving || isLoading || !serverContent}
              onClick={handleResetAllSections}
              className="self-start gap-1.5 rounded-xl text-xs font-semibold sm:self-auto cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset All Sections</span>
            </Button>
          </div>

          <ContentSectionNav
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              {isLoading || !serverContent ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-xs">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />

                  <p className="text-sm font-medium text-foreground">
                    Loading site content from database...
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Fetching the real saved configuration directly from MongoDB.
                  </p>
                </div>
              ) : error ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xs">
                  <p className="text-sm font-medium text-destructive">
                    Failed to load site content from database
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Please ensure the backend API server is reachable.
                  </p>
                </div>
              ) : (
                <>
                  {activeSection === "hero" && (
                    <HeroContentForm
                      key={`hero-${serverContent.updatedAt ?? "v1"}-${resetCounter}`}
                      initialData={serverContent.hero}
                      onChange={(draft) =>
                        setDraftOverrides((prev) => ({ ...prev, hero: draft }))
                      }
                      onSave={(data) => handleSaveSection("hero", data)}
                      onReset={handleResetCurrentSection}
                    />
                  )}

                  {activeSection === "ebooks" && (
                    <EbooksContentForm
                      key={`ebooks-${serverContent.updatedAt ?? "v1"}-${resetCounter}`}
                      initialData={serverContent.ebooks}
                      onChange={(draft) =>
                        setDraftOverrides((prev) => ({ ...prev, ebooks: draft }))
                      }
                      onSave={(data) => handleSaveSection("ebooks", data)}
                      onReset={handleResetCurrentSection}
                    />
                  )}

                  {activeSection === "poetry" && (
                    <PoetryContentForm
                      key={`poetry-${serverContent.updatedAt ?? "v1"}-${resetCounter}`}
                      initialData={serverContent.poetry}
                      onChange={(draft) =>
                        setDraftOverrides((prev) => ({ ...prev, poetry: draft }))
                      }
                      onSave={(data) => handleSaveSection("poetry", data)}
                      onReset={handleResetCurrentSection}
                    />
                  )}

                  {activeSection === "announcement" && (
                    <AnnouncementContentForm
                      key={`announcement-${serverContent.updatedAt ?? "v1"}-${resetCounter}`}
                      initialData={serverContent.announcement}
                      onChange={(draft) =>
                        setDraftOverrides((prev) => ({ ...prev, announcement: draft }))
                      }
                      onSave={(data) => handleSaveSection("announcement", data)}
                      onReset={handleResetCurrentSection}
                    />
                  )}

                  {activeSection === "newsletter" && (
                    <NewsletterContentForm
                      key={`newsletter-${serverContent.updatedAt ?? "v1"}-${resetCounter}`}
                      initialData={serverContent.newsletter}
                      onChange={(draft) =>
                        setDraftOverrides((prev) => ({ ...prev, newsletter: draft }))
                      }
                      onSave={(data) => handleSaveSection("newsletter", data)}
                      onReset={handleResetCurrentSection}
                    />
                  )}
                </>
              )}
            </div>

            <div className="lg:col-span-6">
              {isLoading || !serverContent ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-xs">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />

                  <p className="text-xs text-muted-foreground">
                    Preparing live preview...
                  </p>
                </div>
              ) : (
                previewHero &&
                previewEbooks &&
                previewPoetry &&
                previewAnnouncement && (
                  <ContentPreviewPane
                    activeSection={activeSection}
                    hero={previewHero}
                    ebooks={previewEbooks}
                    poetry={previewPoetry}
                    announcement={previewAnnouncement}
                    newsletter={previewNewsletter}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminContentsPage;
