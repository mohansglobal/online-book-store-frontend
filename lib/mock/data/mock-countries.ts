import type { Country } from "@/features/countries/types/country.types";

export const MOCK_COUNTRIES: Country[] = [
  {
    _id: "country_01",
    name: "India",
    code: "IN",
    phoneCode: "+91",
    currency: "INR",
  },
  {
    _id: "country_02",
    name: "Bangladesh",
    code: "BD",
    phoneCode: "+880",
    currency: "BDT",
  },
  {
    _id: "country_03",
    name: "United States",
    code: "US",
    phoneCode: "+1",
    currency: "USD",
  },
  {
    _id: "country_04",
    name: "United Kingdom",
    code: "GB",
    phoneCode: "+44",
    currency: "GBP",
  },
];
