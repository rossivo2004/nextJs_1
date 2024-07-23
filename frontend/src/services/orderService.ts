import apiClient from './apiClient';

export const getOrder = async () => {
    try {
        const response = await apiClient.get(`/orders/`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await apiClient.post(`/orders/add`, orderData);
        return response.data;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
};

export const getByIdUserOrder = async (id) => {
    try {
        const response = await apiClient.get(`/orders/userbyid/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
};

export const getOrderDetail = async (id) => {
    try {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
};