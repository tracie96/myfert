import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: {},
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfileUser: (state, action) => {
            state.userData = action.payload;
        },
    },
});

export const { updateProfileUser } = profileSlice.actions;
export default profileSlice.reducer;