import { createSlice } from "@reduxjs/toolkit";

const getTotalSelected = () => {
    let total_selected = 0;
    let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
    if (_movieForSell) {
        total_selected = _movieForSell.reduce((n, { total_selected }) => {
            return (total_selected) ? n + total_selected : n
        }, 0);
    }
    return total_selected;
}

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartDetail: {
            nums: getTotalSelected()
        }
    },
    reducers: {
        dispatchCart: (state, action) => {
            state.cartDetail.nums = getTotalSelected();
        },
    }
})

export const { dispatchCart } = cartSlice.actions

export default cartSlice.reducer;