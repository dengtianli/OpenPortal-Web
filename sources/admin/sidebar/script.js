import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
//jquery
import jQuery from "jquery";
export default {
  data() {
    return {
      data1: "",
      data2: ""
    }
  },
  directives: {
    active(el, binding) {
      jQuery(el).on("click", function () {
        jQuery(el).addClass("active").siblings().removeClass("active");
      })
    }
  }
};
