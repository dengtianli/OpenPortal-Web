import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
export default {
  data() {
    return {
      data1: "",
      data2: ""
    }
  },
  methods: {
    onSearch() {
      console.log("on Search!");
    }
  },
    computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
    }
  },
};
