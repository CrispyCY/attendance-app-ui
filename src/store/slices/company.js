// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    details: []
};

const slice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DETAILS
        getDetailsSuccess(state, action) {
            state.details = action.payload;
        },

        // UPDATE EVENT
        updateDetailsSuccess(state, action) {
            state.details = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDetails(id) {
    return async () => {
        try {
            const response = await axios.get('/organization/getOrganization?id=' + id, { withCredentials: true });
            dispatch(slice.actions.getDetailsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateDetails(details) {
    return async () => {
        try {
            const response = await axios.post('/organization/update', details, { withCredentials: true });
            dispatch(slice.actions.updateDetailsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}