import Http from "../../../common/helper/http.js";
import Encrypt from "../../../common/helper/encrypt.js";
import Pager from "../../../common/helper/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      tableData: [],
      objCount: {},
      search_inp: "",
      loading: true
    }
  },
  mounted() {
    const vm = this;
    vm.myNeedData();
  },

  methods: {
    myNeedData: function (curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/businessrequirement/getBusinessreQuirementByUserId",
        data: {
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading = false;
          if (result.status == 200) {
            let data = result.data;
            vm.tableData = data.body;
            vm.objCount.totalR = data[Pager.totalR];
          } else {
            Notification({
              type: "error",
              title: '我的需求',
              message: result.message,
            });
          }
        });
    },
    /** 分页*/
    handleCurrentChange(val) {
      const vm = this;
      vm.myNeedData(val, vm.search_inp, vm.initSelectVal);
    },
    /**搜索 */
    searchClick() {
      const vm = this;
      vm.myNeedData(1, vm.search_inp, vm.initSelectVal);
    }
  }
};
