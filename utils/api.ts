import axios from "axios";
// export const baseURL = ;/

const instance = (baseURL: string = "https://api-socialfi.memegoat.io") => {
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { instance };
// ("Access-Control-Allow-Origin");
