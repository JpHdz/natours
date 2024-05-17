import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? '/api/v1/users/updateme'
        : '/api/v1/users/updateMyPassword';
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
