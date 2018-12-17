import Http from "../../../common/helper/http.js";
import Encrypt from "../../../common/helper/encrypt.js";
import Pager from "../../../common/helper/pager.js";
const master = Http.url.master;
export default {
  data() {
    return {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '同意'
      },{
        value: '2',
        label: '拒绝'
      }],
      initSelectVal: "",
      getApplyList: [],
      getApplyItemList: [],
      applyCount: {},
      search_inp: "",
      flag: true,
      applyItem: {},
      setId: "",
      search_inp2: "",
      currentPage1: 1,
      currentPage2: 1,
      loading: true,
      loading2: true
    }
  },
  mounted() {
    const vm = this;
    vm.getApplyData(1, vm.search_inp);
  },
  methods: {
    /** 申请列表*/
    getApplyData: function (curr_page, search_inp, pendStatus) {
      const vm = this;
      Http.fetch({
        method: "post",
        dataType: "json",
        url: master + "/dataItemapply/getDataItemApplies",
        data: {
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp,
          pendStatus: pendStatus
        }
      }).then(
        function (result) {
          vm.loading =false;
          if (result.status == 200) {
            let data = result.data;
            vm.getApplyList = data.body;
            vm.applyCount.totalR = data[Pager.totalR];
            vm.applyCount.pendingNum = data.examiningCount;
            vm.applyCount.reviewedNum = data.examinedCount;
          } else {
            Notification({
              type: "error",
              title: '申请列表',
              message: result.message,
            });
          }
        });
    },
    getApplyItemData: function (dcm_id, curr_page, search_inp) {
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/dataItemapply/getDataItemApplyDetails",
        data: {
          dcm_id: dcm_id,
          pageNum: curr_page,
          pageSize: 10,
          keywords: search_inp
        }
      }).then(
        function (result) {
          vm.loading2 = false;
          if (result.status == 200) {
            let data = result.data;
            vm.getApplyItemList = data.body;
            vm.applyCount.totalR = data[Pager.totalR];
          } else {
            Notification({
              type: "error",
              title: '申请列表详情',
              message: result.message,
            });
          }
        });
    },
    /** 点击申请列表任意一行得到详情页面*/
    getApplyItem(row, event, column) {
      const vm = this;
      vm.flag = false;
      vm.applyItem.name = row.dirStructure;
      vm.setId = row.dcm_id;
      vm.getApplyItemData(row.dcm_id, 1, vm.search_inp2);
    },
    /** 分页*/
    handleCurrentChange1(val) {
      const vm = this;
      vm.currentPage1 = val;
      vm.getApplyData(val, vm.search_inp, vm.initSelectVal);
    },
    handleCurrentChange2(val) {
      const vm = this;
      vm.getApplyItemData(vm.setId, val, vm.search_inp2);
    },
    /**搜索 */
    searchClick() {
      const vm = this;
      vm.getApplyData(1, vm.search_inp, vm.initSelectVal);
    },
    searchClick2() {
      const vm = this;
      vm.getApplyItemData(vm.setId, 1, vm.search_inp2);
    },
    /**根据是否已审核进行过滤 */
    selectVal() {
      const vm = this;
      vm.getApplyData(1, vm.search_inp, vm.initSelectVal);
    },
    goBack() {
      const vm = this;
      vm.flag = true;
      vm.applyItem = {};
      vm.getApplyData(vm.currentPage1, vm.search_inp, vm.initSelectVal);
    }
  }
};
