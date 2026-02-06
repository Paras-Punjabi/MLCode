import axiosInstance from "@/configs/axios.config";
import { makeUseAxios } from "axios-hooks";

const useAxios = makeUseAxios({
  axios: axiosInstance,
});

export default useAxios;
