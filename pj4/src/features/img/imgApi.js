// src/features/file/fileApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const imgApi = createApi({
  reducerPath: 'imgApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    imgSave: builder.mutation({
      query: (formData) => ({
        url: '/img/imgSave.do',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useImgSaveMutation,
} = imgApi;
