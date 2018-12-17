import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
const master = Http.url.master;
let arrowbg = require('../assets/dashboard/arrow.png');
export default {
  data() {
    return {
      islogin: false,
      username: "",
      password: "",
      activeCatalog: "first",
      selected: "",
      arrow: "",
      keywords: "",//搜索关键字
      departmentCount: "", //已开放部门数
      directoryCount: "", //数据集
      hotData: [], //热门数据
      latestData: [], //最新数据
      themeData:[],
      departmentData:[],
      moreShow: true //主题分类，部门分类列表中更多的显示
    }
  },
  mounted() {
    const vm = this;
    vm.isloginStatus();
    vm.getCatalogList();
    vm.getHotData();
    vm.getLatestData();
    vm.getList();
  },
  methods: {
    /**退出登录 */
    loginOut: function() {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/loginOut",
      }).then(
        function (result) {
          if (result.status == 200) {
            Encrypt.token.empty("userName");
            Encrypt.token.empty("orgName");
            vm.islogin = false;
            alert("退出成功");
            vm.$router.push("/login");
          }
        });
    },
    /**登录状态 */
    isloginStatus() {
      const vm = this;
      let name = Encrypt.token.get("userName");
      vm.username = name;
      if (name) {
        vm.islogin = true;
      }
    },
    getCatalogList: function () { // 头部数据项
      const vm = this;
      Http.fetch({
          method: "get",
          url: Http.url.master + "/home/countDataShareSituation"
        })
        .then(function(result) {
          if (result.status == 200) {
            vm.departmentCount = result.data.departmentCount;
            vm.directoryCount = result.data.directoryCount;
          }
        })
    },
    getHotData: function () { //热门数据
      const vm = this;
      Http.fetch({
        method: "get",
        url: Http.url.master + "/home/getHottestDirectoryList",
        data:{pageSize: 5}
      })
      .then(function(result) {
        if(result.status == 200) {
          vm.hotData = result.data.body;
        }
      })
    },
    getLatestData: function () { //最新数据
      const vm = this;
      Http.fetch({
        method: "get",
        url: Http.url.master + "/home/listLatestDirectory",
        data: {pageSize: 5}
      })
      .then(function(result) {
        if(result.status == 200) {
          let data = result.data.body;
          let array = [];
          _.forEach(data, function(n, key) {
            let time = "";
            if(typeof(n.create_time) == "string") {
              time = n.create_time;
            }else {
              time = JSON.stringify(n.create_time);
            }
            let timeFormat = "";
            if(n.create_time !== null) {
              timeFormat = time.split(' ')[0];
            }
            array.push({
              dataset_name:n.dataset_name,
              create_time:timeFormat,
              org_name:n.org_name,

            })
          })
          vm.latestData = array;
        }
      })
    },
    getList: function() {
      const vm = this;
      Http.fetch({
          method: "get",
          url: master + "/home/getClassifyChildrenWithSubchildrenById"
        })
        .then(function(result) {
          if (result.status == 200) {
            if(vm.activeCatalog == "first") {
              vm.getNodeById(result.data[1])
            }else{
              vm.getNodeById(result.data[2])
            }
          }
        })
    },
    getNodeById: function(item) {
      const vm = this;
      Http.fetch({
        method: "get",
        url: master + "/home/getClassifyChildrenWithSubchildrenById",
        params: {
          id: item.id
        }
      })
      .then(function(result) {
        if(result.status == 200) {
          if (vm.activeCatalog == "first") {
            if(result.data.length > 11) {
              vm.themeData = result.data.slice(0,11);
              console.log(vm.themeData)
              vm.moreShow = true;
            }else {
              vm.themeData = result.data;
              vm.moreShow = false;
            }
          }else {
            if(result.data[0].children.length > 11) {
              vm.departmentData = result.data[0].children.slice(0,11);
              vm.moreShow = true;
            }else {
              vm.departmentData = result.data[0].children;
              vm.moreShow = false;
            }
          }
        }
      })
    },
    searchKeywords() { //search
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/resource',
        query: {
          keywords: _.trim(vm.keywords)
        }
      })
    },
    keydownLogin(ev) {
      const vm = this;
      var event = ev || window.event;
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.searchKeywords();
      }
    },
    subShow(item,index){
      const vm = this;
      vm.subClass[index].display = 'in';
    },
    subHide(item,index){
      const vm = this;
      vm.subClass[index].display = 'out';
    },
    depShow(item,index){
      const vm = this;
      vm.depClass[index].display = 'in';
    },
    depHide(item,index){
      const vm = this;
      vm.depClass[index].display = 'out';
    }
  }
}
