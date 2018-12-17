import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
// 引进组件
import sidebar from "./sidebar/index.vue";
import container from "./container/index.vue";

export default {
  components: {
    sidebar,
    container
  },
  data() {
    return {
    }
  },
  mounted() {
    const vm = this;
    vm.$router.push("/layout/interaction/interactionRequireSurvey");
  },
  methods: {
  },
  watch: {
    $route() {
       if (this.$route.path == '/layout/interaction') {
      this.$router.push("/layout/interaction/interactionRequireSurvey");
       }
    }
  }
};
