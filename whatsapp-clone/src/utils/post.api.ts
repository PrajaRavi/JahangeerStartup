import axios from "axios";

/*
  Create a reusable axios instance.

  Why:
  - avoids repeating baseURL everywhere
  - centralizes credentials config
  - easier to add interceptors later
*/
const api = axios.create({
  baseURL: "http://localhost:4500/",
  withCredentials: true, // send cookies automatically
});

/*
  Generic POST helper.

  Why:
  - keeps thunk code cleaner
  - route becomes flexible
  - only endpoint changes
*/
export const postRequest = async (
  endpoint: string,
  data: any
) => {
  const response = await api.post(endpoint, data);

  return response.data;
};

export const GetRequest = async (
  endpoint: string,
) => {
  const response = await api.get(endpoint);

  return response.data;
};


export default api;