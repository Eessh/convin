import { createSlice, PayloadAction, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TBucket, TCard } from ".";
import axios from "axios";

const initialState: {
  buckets: TBucket[],
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | undefined
} = {
  buckets: [],
  status: "idle",
  error: undefined
}

const API_URL = "https://convin-backend-kjjz.onrender.com/buckets";

export const fetchBucketsThunk = createAsyncThunk("buckets/fetchBuckets", async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  }
  catch (err) {
    return err;
  }
});

export const updateBucketsThunk = createAsyncThunk("buckets/updateBucketsThunk", async (buckets: TBucket[]) => {
  console.log("Buckets: ", buckets);
  try {
    const response = await axios.post(API_URL, {buckets});
    return response.data.buckets;
  }
  catch (err) {
    return err;
  }
});

export const addBucketThunk = createAsyncThunk("buckets/addBucketThunk", async({buckets, bucketName}: {
  buckets: TBucket[],
  bucketName: string
}) => {
  const newBuckets: TBucket[] = [...buckets, { id: nanoid(16), name: bucketName, cards: [] }];
  try {
    const response = await axios.post(API_URL, { buckets: newBuckets });
    return response.data.buckets;
  }
  catch (err) {
    return err;
  }
});

export const removeBucketThunk = createAsyncThunk("buckets/removeBucketThunk", async ({buckets, bucketIndex}: {
  buckets: TBucket[],
  bucketIndex: number
}) => {
  const newBuckets: TBucket[] = buckets.filter((_, index) => index !== bucketIndex);
  try {
    const response = await axios.post(API_URL, { buckets: newBuckets });
    return response.data.buckets;
  }
  catch (err) {
    return err;
  }
});

export const addCardThunk = createAsyncThunk("buckets/addCardThunk", async ({buckets, bucketIndex, cardName, cardLink}: {
  buckets: TBucket[],
  bucketIndex: number,
  cardName: string,
  cardLink: string
}) => {
  const newBuckets: TBucket[] = [...buckets.slice(0, bucketIndex), {
    id: buckets[bucketIndex].id,
    name: buckets[bucketIndex].name,
    cards: [...buckets[bucketIndex].cards, { id: nanoid(), name: cardName, link: cardLink }]
  }, ...buckets.slice(bucketIndex+1)];
  try {
    const response = await axios.post(API_URL, { buckets: newBuckets });
    return response.data.buckets;
  }
  catch (err) {
    return err;
  }
});

export const removeCardThunk = createAsyncThunk("buckets/removeCardThunk", async ({buckets, bucketIndex, cardIndex}: {
  buckets: TBucket[],
  bucketIndex: number,
  cardIndex: number
}) => {
  const newBuckets: TBucket[] = [...buckets.slice(0, bucketIndex), {
    id: buckets[bucketIndex].id,
    name: buckets[bucketIndex].name,
    cards: buckets[bucketIndex].cards.filter((_, index) => index !== cardIndex)
  }, ...buckets.slice(bucketIndex+1)];
  try {
    const response = await axios.post(API_URL, { buckets: newBuckets });
    return response.data.buckets;
  }
  catch (err) {
    return err;
  }
});

export const reorderThunk = createAsyncThunk("buckets/reorderThunk", async ({
  buckets,
  sourceBucketIndex,
  destinationBucketIndex,
  sourceCardIndex,
  destinationCardIndex
}: {
  buckets: TBucket[],
  sourceBucketIndex: number,
  destinationBucketIndex: number,
  sourceCardIndex: number,
  destinationCardIndex: number
}) => {
  const card = buckets[sourceBucketIndex].cards[sourceCardIndex];
  const newBuckets: TBucket[] = JSON.parse(JSON.stringify(buckets));
  newBuckets[sourceBucketIndex].cards.splice(sourceCardIndex, 1);
  newBuckets[destinationBucketIndex].cards.splice(destinationCardIndex, 0, card);
  try {
    const response = await axios.post(API_URL, { buckets: newBuckets });
    return response.data.buckets;
  }
  catch (err) {
    return err;
  }
});

export const BucketsSlice = createSlice({
  name: "buckets",
  initialState,
  reducers: {
    addBucket: (state, action: PayloadAction<TBucket>) => {
      state.buckets = [...state.buckets, action.payload];
    },
    removeBucket: (state, action: PayloadAction<number>) => {
      const bucketIndex = action.payload;
      state.buckets = state.buckets.filter((_, index) => index !== bucketIndex);
    },
    addCard: (state, action: PayloadAction<{
      bucketIndex: number,
      card: TCard
    }>) => {
      const { bucketIndex, card } = action.payload;
      const bucket = state.buckets[bucketIndex];
      bucket.cards.push(card);
      state.buckets = [...state.buckets.slice(0, bucketIndex), bucket, ...state.buckets.slice(bucketIndex+1)];
    },
    removeCard: (state, action: PayloadAction<{
      bucketIndex: number,
      cardIndex: number
    }>) => {
      const { bucketIndex, cardIndex } = action.payload;
      const bucket = state.buckets[bucketIndex];
      bucket.cards = bucket.cards.filter((_, index) => index !== cardIndex);
      state.buckets = [...state.buckets.slice(0, bucketIndex), bucket, ...state.buckets.slice(bucketIndex+1)];
    },
    reorder: (state, action: PayloadAction<{
      sourceBucketIndex: number,
      destinationBucketIndex: number,
      sourceCardIndex: number,
      destinationCardIndex: number
    }>) => {
      const {
        sourceBucketIndex,
        destinationBucketIndex,
        sourceCardIndex,
        destinationCardIndex
      } = action.payload;
      const card = state.buckets[sourceBucketIndex].cards[sourceCardIndex];
      const newBuckets: TBucket[] = JSON.parse(JSON.stringify(state.buckets));
      newBuckets[sourceBucketIndex].cards.splice(sourceCardIndex, 1);
      newBuckets[destinationBucketIndex].cards.splice(destinationCardIndex, 0, card);
      state.buckets = newBuckets;
    }
  },
  extraReducers: (builder) => {
    builder
    // Fetch Buckets
    .addCase(fetchBucketsThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchBucketsThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      const buckets: TBucket[] = action.payload;
      state.buckets = buckets;
    })
    .addCase(fetchBucketsThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    // Update Buckets
    .addCase(updateBucketsThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateBucketsThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.buckets = action.payload;
    })
    .addCase(updateBucketsThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    // Add Bucket
    .addCase(addBucketThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addBucketThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      const buckets: TBucket[] = action.payload;
      console.log("Buckets in thunk: ", buckets);
      state.buckets = buckets;
    })
    .addCase(addBucketThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    // Remove Bucket
    .addCase(removeBucketThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(removeBucketThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.buckets = action.payload;
    })
    .addCase(removeBucketThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    // Add Card
    .addCase(addCardThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addCardThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.buckets = action.payload;
    })
    .addCase(addCardThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    // Remove Card
    .addCase(removeCardThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(removeCardThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      const buckets: TBucket[] = action.payload;
      state.buckets = buckets;
    })
    .addCase(removeCardThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    // Reorder
    .addCase(reorderThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(reorderThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.buckets = action.payload;
    })
    .addCase(reorderThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
  },
});

export const { addBucket, addCard, removeBucket, removeCard, reorder } = BucketsSlice.actions;
export const selectBuckets = (state: RootState) => state.buckets.buckets;
export const selectBucket = (state: RootState, bucketIndex: number) => state.buckets.buckets[bucketIndex];
export const selectCards = (state: RootState, bucketIndex: number) => state.buckets.buckets[bucketIndex].cards;
export const selectCard = (state: RootState, bucketIndex: number, cardIndex: number) => state.buckets.buckets[bucketIndex].cards[cardIndex];

export default BucketsSlice.reducer;