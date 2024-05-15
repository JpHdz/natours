import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:3000/api/v1/users/updateme'
        : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated succesfully`);
      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
