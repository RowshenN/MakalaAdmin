import { configureStore } from "@reduxjs/toolkit";

import { categoryApi } from "@/services/categoryApi";
import { magazineApi } from "@/services/magazineApi";
import { authorApi } from "@/services/authorApi";
import { issueApi } from "@/services/issueApi";
import { articleApi } from "@/services/articleApi";

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [magazineApi.reducerPath]: magazineApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
    [issueApi.reducerPath]: issueApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoryApi.middleware,
      magazineApi.middleware,
      authorApi.middleware,
      issueApi.middleware,
      articleApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
