// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../features/user/userApi';
import { writeApi } from '../features/write/writeApi'; 
import { fileApi } from '../features/file/fileApi'; 
import { comboApi  } from '../features/combo/combo';
import { imgApi  } from '../features/img/imgApi';
import { diaryApi } from '../features/diary/diaryApi';
import { alarmApi } from '../features/alarm/alarmApi';
import { plantApi } from '../features/plant/plantApi';

import userReducer from '../features/user/userSlice';
import storageSession from 'redux-persist/lib/storage/session'; // sessionStorage로 변경
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage: storageSession, // sessionStorage로 변경
  whitelist: ['user'] // user slice만 저장
};

const rootReducer = combineReducers({
  user: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [writeApi.reducerPath]: writeApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [comboApi.reducerPath]: comboApi.reducer,
  [imgApi.reducerPath]: imgApi.reducer,
  [diaryApi.reducerPath]: diaryApi.reducer,
  [alarmApi.reducerPath]: alarmApi.reducer,
  [plantApi.reducerPath]: plantApi.reducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      userApi.middleware,
      writeApi.middleware,
      fileApi.middleware,
      comboApi.middleware,
      imgApi.middleware,
      diaryApi.middleware,
      alarmApi.middleware,
      plantApi.middleware
    )
});

export const persistor = persistStore(store);