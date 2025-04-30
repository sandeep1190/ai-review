import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://aireview.lawfirmgrowthmachine.com/api/",
});

export default axiosInstance;
