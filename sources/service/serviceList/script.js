import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
import {formatDate} from "../../common/helper/date.js";
import Pager from "../../common/helper/pager.js";
const master = Http.url.master;
import leftMenu from "../left.menu/index.vue";
export default {
  components: {
    leftMenu
  },
  data() {
      return {
        currentPage:1,
        total:237,
        departmentCount:"",//已开放部门数
        directoryCount:""//已开放数据集
      }
    },
    mounted() {
      const vm = this;
      vm.loadData();
      vm.getCatalogList();
    },

    methods: {
      loadData(){
        const vm = this;
        // vm.head_title = vm.$route.query.dirName;
        // var dirCode = vm.$route.query.dirCode;
        // vm.getResources(dirCode,vm.currentPage,20,vm.keyword).then(function(res){
        //   vm.loading = false;
        //   if(res.status == 200) {
        //     var r_data = res.data;
        //     vm.tableData = r_data.body;
        //     vm.totalResource = r_data[Pager.totalR];
        //     vm.itemCount = res.data.itemCount; // 数据项
        //   }
        //   else{
        //      vm.$message({
        //           type: "error",
        //           title: '系统错误',
        //           message: res.message,
        //         });
        //   }
        // })
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
      getResources: function(dirCode,currentPage,psize,keyword) {
        const vm = this;
        return Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetByClassfyTreeCode",
          data: {
            tree_code: dirCode,
            pageNum:currentPage,
            size:psize,
            keywords:keyword
          }
        })
      },
      toggleView(showTable) {
        const vm = this;
        console.log(showTable);
        vm.showTable = showTable;
      },
      handleCurrentChange(val) {// 点击表格行
        this.currentRow = val;
        this.$router.push({ path: '/layout/catalog/details',
          query:{dirName:val.dataset_name,ddcm_id:val.ddcm_id}})
      },
      handlePageChange(val){// 分页处理
        console.log(val)
        const vm = this;
        vm.currentPage = val;
        vm.loadData();
      },
      handleSearch(){
        const vm = this;
        vm.currentPage = 1;
        vm.loadData();
      }
    },
    filters:{
        formatDate(time){
          if(!time) {
            return "";
          }
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
        }
    }
};
