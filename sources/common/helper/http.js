import Encrypt from "./encrypt";
import Axios from "axios";

export default {
  url: window.url,
  fetch: Axios.create({
    // timeout: 1000,
    withCredentials: true,
    validateStatus: function (status) {
      return status >= 200 && status < 550;
    }
  }),
  protocol(data, status) {
    console.log(status);
    if (data && data.head &&
      data.head.status === status &&
      data.hasOwnProperty("head") &&
      data.hasOwnProperty("body"))
      return true;
    else
      return false;
  }
};
