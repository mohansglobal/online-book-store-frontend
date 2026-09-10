import type { StaticImageData } from "next/image";

import novelsImg from "@/assets/novels.jpeg";
import poetryImg from "@/assets/poetry.jpeg";
import shortImg from "@/assets/short.jpeg";
import sportImg from "@/assets/sport.jpeg";
import spiritualityImg from "@/assets/sprit.jpeg";
import politicsImg from "@/assets/politics.jpeg";
import translationImg from "@/assets/translation.jpeg";
import eBooksImg from "@/assets/ebook.jpeg";
import textBooksImg from "@/assets/text-book.jpeg";
import fineBalance from "@/assets/fineBalance.jpeg";
import midnightsChildren from "@/assets/midnightsChildren.jpeg";
import namesake from "@/assets/namesake.jpeg";
import palaceIllusions from "@/assets/palaceIllusions.jpeg";
import smallThings from "@/assets/smallThings.jpeg";
import suitableBoy from "@/assets/suitableBoy.jpeg";
import trainPakistan from "@/assets/trainPakistan.jpeg";
import whiteTiger from "@/assets/whiteTiger.jpeg";
import coverCode from "@/assets/cover-code.jpg";
import coverGarden from "@/assets/cover-garden.jpg";
import coverLight from "@/assets/cover-light.jpg";
import coverMidnight from "@/assets/cover-midnight.jpg";
import coverOcean from "@/assets/cover-ocean.jpg";
import coverOrbit from "@/assets/cover-orbit.jpg";
import coverRiver from "@/assets/cover-river.jpg";
import coverSilence from "@/assets/cover-silence.jpg";
import khoabnama from "@/assets/khoabnama.jpg";
import mastiskerMalikana from "@/assets/mastisker-malikana.jpg";
import patherpanchali from "@/assets/patherpanchali.jpeg";
import freshnew from "@/assets/freshnew.jpeg";
import newbook from "@/assets/newbook.jpeg";
import verynew from "@/assets/verynew.jpeg";

export const CATEGORY_IMAGE_MAP: Record<string, StaticImageData> = {
  novel: novelsImg,
  fiction: novelsImg,
  poetry: poetryImg,
  poem: poetryImg,
  kobita: poetryImg,
  short: shortImg,
  story: shortImg,
  stories: shortImg,
  spirituality: spiritualityImg,
  spiritual: spiritualityImg,
  religion: spiritualityImg,
  dhormo: spiritualityImg,
  politics: politicsImg,
  history: politicsImg,
  sport: sportImg,
  sports: sportImg,
  translation: translationImg,
  translations: translationImg,
  anubad: translationImg,
  ebook: eBooksImg,
  ebooks: eBooksImg,
  academic: textBooksImg,
  textbook: textBooksImg,
  textbooks: textBooksImg,
  education: textBooksImg,
  thriller: midnightsChildren,
  mystery: midnightsChildren,
  mythology: palaceIllusions,
  drama: fineBalance,
  biography: suitableBoy,
  classics: trainPakistan,
  classic: trainPakistan,
  philosophy: coverSilence,
  science: coverCode,
  tech: coverCode,
  technology: coverCode,
  nature: coverGarden,
  environment: coverRiver,
  ocean: coverOcean,
  space: coverOrbit,
  night: coverMidnight,
  light: coverLight,
  bengali: patherpanchali,
  literature: smallThings,
  mind: mastiskerMalikana,
  dream: khoabnama,
  new: freshnew,
  latest: verynew,
  book: newbook,
  tiger: whiteTiger,
  identity: namesake,
};

export const ASSET_IMAGES: StaticImageData[] = [
  novelsImg,
  poetryImg,
  shortImg,
  spiritualityImg,
  politicsImg,
  sportImg,
  translationImg,
  eBooksImg,
  textBooksImg,
  fineBalance,
  midnightsChildren,
  namesake,
  palaceIllusions,
  smallThings,
  suitableBoy,
  trainPakistan,
  whiteTiger,
  coverCode,
  coverGarden,
  coverLight,
  coverMidnight,
  coverOcean,
  coverOrbit,
  coverRiver,
  coverSilence,
  khoabnama,
  mastiskerMalikana,
  patherpanchali,
  freshnew,
  newbook,
  verynew,
];

export function getCategoryImage(
  name = "",
  slug = "",
  index = 0,
): StaticImageData {
  const query = `${name} ${slug}`.toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (query.includes(key)) {
      return img;
    }
  }
  return ASSET_IMAGES[index % ASSET_IMAGES.length];
}
