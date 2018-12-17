import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
import {
  formatDate
} from "../../common/helper/date.js";
import Pager from "../../common/helper/pager.js";
const master = Http.url.master;
export default {
  data() {
    var checkCount = (rule, value, callback) => {
      if (value.length > 500) {
        return callback('最多只能输入500个字符,你已经不能再输入了！');
      } else {
        callback();
      }
    };
    return {
      loading: true,
      head_title: '',
      activeTab: 'itemlist',
      tableDataItem: [],
      tableInterfaces: [],
      dataSetFiles: [],
      currentPage: 1,
      totalR: 0,
      totalR1:0,
      operateble: true,
      Pid: this.$route.query.pid,
      detailData: {},
      dataSetId: this.$route.query.setId,
      editable: false, // 数据申请时间空间是否可编辑
      collectionStatus: false, //是否收藏状态
      dialogFormVisible: false, // 纠错对话框可见性
      correctionForm: {
        content: ''
      },
      rateForm: {
        stars: 0
      },
      applyForm: {
        count: null,
        timeRange: null,
        description: ''
      },
      formRules: {
        content: [{
          validator: checkCount,
          trigger: 'blur,change'
        }]
      }
    }
  },
  mounted() {
    const vm = this;
    vm.$emit('clicknode', false);
    vm.loadData();
    vm.getDetail(vm.Pid);
    vm.getTable(vm.dataSetId,1);
  },
  methods: {
    checkLogin: function () { //是否登录
      if (Encrypt.token.get("userName")) {
        return true;
      }
      return false;
    },
    elLogin(message) { //弹出登录框的描述信息
      const vm = this;
      vm.$message({
        showClose: true,
        message: message,
        type: 'warning'
      });
      // 弹出登录框
      setTimeout(function () {
        vm.$parent.$parent.openLoginDialog();
      }, 1000);
    },
    loadData() {
      const vm = this;
      vm.head_title = vm.$route.query.name;
    },
    getDetail: function (pid) { //详情页上半部分内容
      const vm = this;
      Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetDetailsById",
          data: {
            ddcm_id: pid
          }
        })
        .then(function (result) {
          if (result.status == 200) {
            vm.detailData = result.data;
            vm.collectionStatus = vm.detailData.isCollection;
          } else {
            vm.$message({
              type: "error",
              title: '详情查询错误',
              message: result.message
            });
          }
        })
    },
    getTable: function (dataSetId,curr_page) {
      const vm = this;
      Http.fetch({
          method: "post",
          url: master + "/dataitem/getDatItemByDateSetId",
          data: {
            dataset_id: dataSetId,
            pageNum: curr_page,
            pageSize: 10,
          }
        })
        .then(function (result) {
          if (result.status == 200) {
            let data = result.data;
            vm.tableDataItem = data.body;
            if (!data.previous) {
              vm.totalR1 = data[Pager.totalR];
            }
          }
        })
    },
    getDataSetFiles: function (dataSetId, curr_page) {
      const vm = this;
      Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetFilesById",
          data: {
            dataset_id: dataSetId,
            pageNum: curr_page,
            pageSize: 10,
          }
        })
        .then(function (result) {
          if (result.status == 200) {
            let data = result.data
            vm.dataSetFiles = data.body;
            if (!data.previous) {
              vm.totalR = data[Pager.totalR];
            }
          }
        })
    },
    handleClick(tab, event) {
      const vm = this;
      if (tab.name == "setFiles") {
        vm.getDataSetFiles(vm.dataSetId, 1);
      }
    },
    handleItemDetail(itemName, itemObj) { //点击数据项名称
      this.$router.push({
        path: '/layout/catalog/itemDetails',
        query: {
          itemName: itemName,
          itemObj: itemObj
        }
      });
    },
    handleCollection() { // 收藏/取消收藏
      const vm = this;
      if (vm.checkLogin()) {
        if (vm.collectionStatus) { // 已收藏，则取消收藏
          vm.deleteCollection(vm.Pid).then(function (res) {
            if (res.status == 200) {
              if (res.data.status) {
                vm.collectionStatus = false;
                vm.$message({
                  showClose: true,
                  message: '取消收藏成功！',
                  type: 'success'
                });
              }
            }
          })
        } else { // 未收藏，则收藏
          vm.insertCollection(vm.Pid).then(function (res) {
            if (res.status == 200) {
              if (res.data.status) {
                vm.collectionStatus = true;
                vm.$message({
                  showClose: true,
                  message: '收藏成功！',
                  type: 'success'
                });
              } else {
                vm.$message({
                  showClose: true,
                  message: '收藏失败！',
                  type: 'error'
                });
              }
            }
          })
        }
      } else {
        vm.elLogin('登录后才能执行操作，请登录！');
      }

    },

    getCorrection() { // 获取纠错内容
      const vm = this;
      if (vm.checkLogin()) {
        vm.dialogFormVisible = true;
        vm.correctionForm.content = vm.detailData.correct_content;
      } else {
        vm.elLogin('登录后才能执行操作，请登录！');
      }

    },
    handleCorrection() { // 提交纠错内容
      const vm = this;
      vm.insertCorrection(vm.Pid, vm.detailData.correction_Id, vm.correctionForm.content).then(function (res) {
        if (res.status == 200) {
          if (res.data.status) {
            vm.dialogFormVisible = false; //关闭对话框
            vm.$message({
              showClose: true,
              message: '纠错成功！',
              type: 'success'
            });
            vm.getDetail(vm.Pid);
          } else {
            vm.$message({
              type: "error",
              title: '纠错失败',
              message: res.message,
            });
          }

        }
        // else {
        //   vm.$message({
        //     type: "error",
        //     title: '纠错失败！',
        //     message: res.message
        //   });
        // }

      })
    },
    goback() {
      if (this.$route.query.t) {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    },
    deleteCollection: function (ddcm_id) { // 取消收藏
      return Http.fetch({
        method: "put",
        url: master + "/dataCollection/deleteCollection",
        data: {
          ddcm_id: ddcm_id // 资源code
        }
      })
    },
    insertCollection: function (ddcm_id) { // 添加收藏
      return Http.fetch({
        method: "put",
        url: master + "/dataCollection/createCollection",
        data: {
          ddcm_id: ddcm_id // 资源code
        }
      })
    },
    insertCorrection: function (ddcm_id, correction_Id, content) { // 提交纠错信息
      return Http.fetch({
        method: "post",
        url: master + "/dataCorrection/createDataCorrection",
        data: {
          ddcm_id: ddcm_id, // 资源code
          correction_Id: correction_Id,
          correct_content: content
        }
      })
    },
    handlePageChange(val) { // 分页处理
      const vm = this;
      vm.getDataSetFiles(vm.dataSetId, val);
    },
     handlePageChangeData(val) { // 分页处理
      const vm = this;
      vm.getTable(vm.dataSetId,val);
    }
  },
};
