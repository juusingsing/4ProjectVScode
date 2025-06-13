import {createApi} from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery'; 
export const calendarApi = createApi({
  reducerPath: 'calendarApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    calendarDot: builder.query({
      query: (params) => ({
        url: '/calendar/dot.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
    calendarLog: builder.query({
      query: (params) => ({
        url: '/calendar/log.do',
        method: 'POST',
        body: params,
      }),
      keepUnusedDataFor: 0, // = cacheTime: 0
      refetchOnMountOrArgChange: true,
      staleTime: 0, // 이건 RTK Query에서 직접 사용되진 않음. react-query에서 쓰는 용어
    }),
  }),
});

export const {
    useCalendarDotQuery,
    useCalendarLogQuery
} = calendarApi;
