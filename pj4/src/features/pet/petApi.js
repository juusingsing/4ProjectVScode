import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; // 인증 및 에러 처리 커스텀


export const petApi = createApi({
  reducerPath: 'petApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    Pet_Form: builder.mutation({
      query: (formData) => ({
        url: '/pet/animalregister.do',
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Update: builder.mutation({
      query: (formData) => ({
        url: '/pet/petUpdate.do',
        method: 'POST',
        body: formData,
      }),
    }),
    Pet_Form_Hospital: builder.mutation({
      query: (formData) => ({
        url: '/pet/petHospital.do',
        method: 'POST',
        body: formData,
      }),
    }),
    deletePet: builder.mutation({
      query: (payload) => ({
        url: '/pet/petDelete.do',
        method: 'POST',
        body: new URLSearchParams(payload),  // { animalId: 123 } 형태의 객체 받음
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
    getPetById: builder.query({
      query: (animalId) => ({
        url: `/pet/getPetById.do`,
        method: 'GET',
        params: { animalId },
      }),
    }),
  }),
});

export const {
  usePet_FormMutation,
  usePet_Form_UpdateMutation,
  usePet_Form_HospitalMutation,
  useDeletePetMutation,
  useGetPetByIdQuery,
} = petApi;