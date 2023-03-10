import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/auth';
import { favoritesToggle } from 'services/notices';

const eraseErrors = createAsyncThunk('auth/eraseErrors', () => {});

const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const result = await api.register(user);

    if (result._id) {
      const { email, password } = user;
      return await api.login({ email, password });
    }
  } catch (error) {
    let message = '';
    if (error.response.status === 409)
      message = 'User with the same email already registrated';
    if (error.response.status === 401) message = 'Data is wrong';
    if (error.response.status === 500)
      message = 'BackEnd dead, please try later';
    return thunkAPI.rejectWithValue(message);
  }
});

const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await api.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue('Wrong password or email');
  }
});

const update = createAsyncThunk('auth/update', async (updateData, thunkAPI) => {
  try {
    const result = await api.update(updateData);
    return result;
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.logout();
    return true;
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const refresh = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
  const { token } = thunkAPI.getState().auth;
  if (!token) {
    return;
  };
  try {
    return await api.refresh(token);
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const profile = createAsyncThunk('auth/profile', async (_id, thunkAPI) => {
  try {
    const result = await api.profile(_id);
    return result;
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const getUsers = createAsyncThunk('auth/getUsers', async (_, thunkAPI) => {
  try {
    const result = await api.getUsers();
    return result;
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const favorites = createAsyncThunk('auth/favorites', async (id, thunkAPI) => {
  try {
    const {favorites} = await favoritesToggle(id);
    return favorites;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const addPet = createAsyncThunk('auth/addPet', async (pet, thunkAPI) => {
  try {
    const result = await api.addPet(pet);
    return result;
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const removePet = createAsyncThunk('auth/removePet', async (_id, thunkAPI) => {
  try {
    const result = await api.removePet(_id);
    return { result, _id };
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const updatePet = createAsyncThunk('auth/updatePet', async(data, thunkAPI) => {
  try {
    const {_id, updateData} = data;
    const result = await api.updatePet(_id, updateData);
    return result;
  } catch ({ response }) {
    return thunkAPI.rejectWithValue(response.data.message);
  }
});

const authOperations = {
  register,
  login,
  logout,
  refresh,
  update,
  eraseErrors,
  profile,
  favorites,
  getUsers,
  addPet,
  removePet,
  updatePet
};

export default authOperations;
