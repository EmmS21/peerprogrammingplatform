// with auth
import axios from 'axios'

export default function axiosWithAuth() {
  const token = window.localStorage.getItem('token')
  return axios.create({
    headers: {
      Authorization: token,
    }
  })
}
