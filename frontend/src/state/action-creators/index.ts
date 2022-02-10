import axios from "axios";
import { Dispatch } from "redux";
import { ActionType } from "../action-types";
import { Action } from "../actions/index";

export const addToCart = (id: string, qty: number) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    const { data } = await axios.get(`/api/v1/products/${id}`);

    dispatch({
      type: ActionType.CART_ADD_ITEM,
      payload: {
        product: data.product._id,
        name: data.product.name,
        image: data.product.image,
        price: data.product.price,
        countInStock: data.product.countInStock,
        qty,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };
};

export const removeFromCart = (id: string) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    dispatch({
      type: ActionType.CART_REMOVE_ITEM,
      payload: id,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };
};

export const saveShippingAddress = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CART_SAVE_SHIPPING_ITEM,
      payload: data,
    });

    localStorage.setItem("shippingAddress", JSON.stringify(data));
  };
};

export const savePaymentMethod = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CART_SAVE_PAYMENT_ITEM,
      payload: data,
    });

    localStorage.setItem("paymentMethod", JSON.stringify(data));
  };
};

export const getProducts = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_PRODUCTS_REQUEST,
      });

      const { data } = await axios.get(`/api/v1/products`);

      dispatch({
        type: ActionType.GET_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_PRODUCTS_FAIL,
        payload: error,
      });
    }
  };
};

export const getProduct = (id: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.GET_PRODUCT_REQUEST,
      });

      const { data } = await axios.get(`/api/v1/products/${id}`);

      dispatch({
        type: ActionType.GET_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.GET_PRODUCT_FAIL,
        payload: error,
      });
    }
  };
};

export const addReview = (id: string, rating: number, comment: string) => {
  return async (dispatch: Dispatch<Action>, getState: any) => {
    try {
      dispatch({
        type: ActionType.ADD_REVIEW_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/v1/products/${id}/review`,
        { rating, comment },
        config
      );

      dispatch({
        type: ActionType.ADD_REVIEW_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.ADD_REVIEW_FAIL,
        payload: error,
      });
    }
  };
};

export const register = (name: string, email: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.USER_REGISTER_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = {
        name,
        email,
        password,
      };

      const { data } = await axios.post("/api/v1/users", formData, config);

      dispatch({
        type: ActionType.USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionType.USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error: any) {
      dispatch({
        type: ActionType.USER_REGISTER_FAIL,
        payload: error,
      });
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.USER_LOGIN_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = {
        email,
        password,
      };

      const { data } = await axios.post(
        "/api/v1/users/login",
        formData,
        config
      );

      dispatch({
        type: ActionType.USER_LOGIN_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionType.USER_LOGIN_FAIL,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error: any) {
      dispatch({
        type: ActionType.USER_REGISTER_FAIL,
        payload: error,
      });
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<Action>) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: ActionType.USER_LOGOUT, payload: {} });
  };
};