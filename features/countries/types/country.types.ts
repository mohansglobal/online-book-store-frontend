// Country domain types matching backend /api/v1/countries

export type Country = {
  _id: string;
  name: string;
  code: string;
  phoneCode?: string;
  currency?: string;
};

export type CountriesResponse = {
  success: boolean;
  message: string;
  data: Country[];
};

export type GetCountriesParams = {
  search?: string;
  limit?: number;
  page?: number;
};
