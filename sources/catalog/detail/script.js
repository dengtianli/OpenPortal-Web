import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
import {
  formatDate
} from "../../common/helper/date.js";
import Pager from "../../common/helper/pager.js";
const master = Http.url.master;
import leftMenu from "../left.menu/index.vue";
import elLogin from "../../common/login-dialog/index.vue";
export default {
  components: {
    leftMenu,
    elLogin
  },
  data() {
    var checkCount = (rule, value, callback) => {
      if (value == null || value == '') {
        return callback();
      }
      //setTimeout(() => {
      if (isNaN(value)) {
        callback(new Error('请输入数字值'));
      } else {
        var value = parseInt(value);
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        }
        if (value < 1) {
          callback(new Error('请输入大于0的数字值'));
        } else if (value > 2147483647) {
          callback(new Error('访问次数超过最大限制'));
        } else {
          callback();
        }
      }
      //}, 1000);
    };
    return {
      loading: true,
      head_title: '',
      activeTab: 'itemlist',
      tableDataItem: [],
      tableInterfaces: [],
      operateble: true,
      Pid:this.$route.query.pid,
      detailData:{},
      dataSetId:this.$route.query.setId,
      editable: false, // 数据申请时间空间是否可编辑
      collectionStatus: false, //是否收藏状态
      dialogFormVisible: false, // 纠错对话框可见性
      showDialogComponent:false,//登录弹框
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
        count: [{
          validator: checkCount,
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    const vm = this;
    vm.loadData();
    vm.getDetail(vm.Pid);
    vm.getTable(vm.dataSetId);
  },
  methods: {
    checkLogin: function() { //是否登录
      if (Encrypt.token.get("userName")) {
        return true;
      }
      return false;
      vm.showDialogComponent = true
    },
    loadData() {
      const vm = this;
      vm.head_title = vm.$route.query.name; 
    },
    getDetail: function(pid) { //详情页上半部分内容
      const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/dataset/getDataSetDetailsById",
        data: {
          ddcm_id: pid
        }
      })
      .then(function(result) {
        if(result.status == 200) {
          vm.detailData = result.data;
          vm.collectionStatus = vm.detailData.isCollection;
        }else {
          vm.$message({
            type: "error",
            title: '详情查询错误',
            message: result.message
          });
        }
      })
    },
    getTable: function(dataSetId) {
       const vm = this;
      Http.fetch({
        method: "post",
        url: master + "/dataitem/getDatItemByDateSetId",
        data: {
          dataset_id: dataSetId
        }
      })
      .then(function(result) {
        if(result.status == 200) {
          vm.tableDataItem = result.data
        }else {
          vm.$message({
            type: "error",
            title: '详情查询错误',
            message: result.message
          });
        }
      })
    },
    handleClick(tab, event) {
      const vm = this;
      if (tab.name == "interfaceinfo") {
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
      vm.showDialogComponent = false
      console.log(vm.showDialogComponent)
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
            } else {
              vm.$message({
                type: "error",
                title: '登录超时',
                message: "登录超时"
              });
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
            } else {
              vm.$message({
                type: "error",
                title: '查询错误',
                message: res.message,
              });
            }
          })
        }
      } else {
        vm.$message({
          showClose: true,
          message: '登录后才能执行操作，请登录！',
          type: 'warning'
        });
        // 弹出登录框
        setTimeout(function () {
          vm.showDialogComponent =true;
        }, 1000);
      }

    },
    getCorrection() { // 获取纠错内容
      const vm = this;
      vm.dialogFormVisible = true;
      vm.correctionForm.content = vm.detailData.correct_content;
    },
    handleCorrection() { // 提交纠错内容
      const vm = this;
      vm.insertCorrection(vm.Pid,vm.detailData.correction_Id,vm.correctionForm.content).then(function (res) {
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

        } else {
          vm.$message({
            type: "error",
            title: '纠错失败！',
            message: res.message
          });
        }

      })
    },
    goback() {
      this.$router.go(-1);
    },
    deleteCollection: function(ddcm_id) { // 取消收藏
      return Http.fetch({
        method: "put",
        url: master + "/dataCollection/deleteCollection",
        data: {
          ddcm_id: ddcm_id // 资源code
        }
      })
    },
    insertCollection: function(ddcm_id) { // 添加收藏
      return Http.fetch({
        method: "put",
        url: master + "/dataCollection/createCollection",
        data: {
          ddcm_id: ddcm_id // 资源code
        }
      })
    },
    insertCorrection: function(ddcm_id, correction_Id, content) { // 提交纠错信息
        return Http.fetch({
          method: "post",
          url: master + "/dataCorrection/createDataCorrection",
          data: {
            ddcm_id: ddcm_id, // 资源code
            correction_Id:correction_Id,
            correct_content: content
          }
        })
      },
  },
  goback() {
    this.$router.go(-1);
  }
};
