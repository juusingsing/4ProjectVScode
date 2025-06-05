// src/features/plant/plantApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const plantApi = createApi({
  reducerPath: 'plantApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    createPlant: builder.mutation({
      query: (formData) => ({
        url: '/plant/create.do',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreatePlantMutation,
} = plantApi;
