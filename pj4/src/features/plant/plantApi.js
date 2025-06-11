import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; // 인증 및 에러 처리용 커스텀 baseQuery

export const plantApi = createApi({
  reducerPath: 'plantApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({

    // 식물 등록
    createPlant: builder.mutation({
      query: (formData) => {
        return {
          url: '/plant/create.do',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // 식물 수정
    updatePlant: builder.mutation({
      query: (formData) => {
        return {
          url: '/plant/update.do',
          method: 'PUT',
          body: formData,
        };
      },
    }),

    // 식물 단건 조회 (GET)
    getPlant: builder.query({
      query: (plantId) => {
        return {
          url: `/plant/${plantId}`,
          method: 'GET',
        };
      },
    }),

    // 식물 목록 조회 (GET)
    getPlantList: builder.query({
      query: () => {
        return {
          url: '/plant/list',
          method: 'GET',
        };
      },
    }),

    // 식물 삭제 (DELETE)
    deletePlant: builder.mutation({
      query: (plantId) => {
        return {
          url: `/plant/${plantId}`,
          method: 'DELETE',
        };
      },
    }),

    // 식물 조회
    getSimplePlantList: builder.mutation({
      query: () => {
        return {
          url: '/plant/simple-list.do',
          method: 'POST',
        };
      },
    }),

    // 식물 저장
    saveSunlightInfo: builder.mutation({
      query: (formData) => ({
        url: '/plant/save.do',
        method: 'POST',
        body: formData,
      }),
      // responseHandler: 'text',
      // transformResponse: (response) => response.data,
      // },
    }),

    // 식물 일조량 조회
    SunlightLogs: builder.query({
      query: (formData) => ({
        url: '/plant/sunlight-logs.do',
        method: 'POST',
        body: formData,
      }),
      keepUnusedDataFor: 0, 
      refetchOnMountOrArgChange: true,
      staleTime: 0, 
    }),

    // 식물 일조량 개별 삭제
    deleteSunlightLog: builder.mutation({
      query: (sunlightLogId) => { // Renamed 'params' to 'sunlightLogId' for clarity
        return {
          url: '/plant/sunlight-delete.do',
          method: 'POST', // Backend expects POST
          body: { plantSunlightingId: sunlightLogId }, 
          };
        },
      }),

      //식물 일조량 개별 수정
      updateSunlightLog: builder.mutation({
        query: (sunlightLogId) => { // Renamed 'params' to 'sunlightLogId' for clarity
          return {
            url: '/plant/sunlight-update.do',
            method: 'POST', // Backend expects POST
            body: { plantSunlightingId: sunlightLogId }, 
            };
          },
        }),
      }),
    });
  
    
export const {
  useUpdateSunlightLogMutation,
  useDeleteSunlightLogMutation,   // 식물 일조량 개별 삭제
  useSunlightLogsQuery,           // 식물 일조량 조회
  useSaveSunlightInfoMutation,
  useGetSimplePlantListMutation,
  useCreatePlantMutation,         // 식물 등록
  useUpdatePlantMutation,         // 식물 수정
  useGetPlantQuery,               // 식물 단건 조회
  useGetPlantListQuery,           // 식물 목록 조회
  useDeletePlantMutation,         // 식물 삭제
} = plantApi;
