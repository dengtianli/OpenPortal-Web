import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
import {
  formatDate
} from "../../common/helper/date.js";
import Pager from "../../common/helper/pager.js";
const master = Http.url.master;
import leftMenu from "../left.menu/index.vue";
export default {
  components: {
    leftMenu
  },
  data() {
    return {
      loading: true,
      head_title: '',
      activeTab: 'itemlist'
    }
  },
  mounted() {
    const vm = this;
    vm.loadData();
  },

  methods: {
    loadData() {
      const vm = this;
      vm.head_title = vm.$route.query.name;
    },
    handleClick(tab, event) {
      const vm = this;
      // console.log(tab, event);
      if (tab.name == "interfaceinfo") {
      }
    }
  }
};
