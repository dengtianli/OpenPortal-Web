import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
import {formatDate} from "../../common/helper/date.js";
import Pager from "../../common/helper/pager.js";
const master = Http.url.master;
export default {
  data() {
      return {
        keywords: this.$route.query.keywords,
        code:this.$route.query.dirCode,
        currentPage:1,
        total:1190,
        head_title:"",
        loading: true,
        catalogData: [],
        totalResource:"",
        totalR: 0,
        itemCount:"",
        // downloadUrl:""
       
      }
    },
    mounted() {
      const vm = this;
      vm.$emit('clicknode',true); 
      if(vm.code){
        vm.loadData(1,vm.code,vm.keywords);
      }else{
        vm.getCatalogData(1, vm.keywords);
      }
    },

    methods: {  
      loadData(num,code,key) {
        const vm = this;
        Http.fetch({
          method: "post",
          url: master + "/dataset/getDataSetByClassfyTreeCode",
          data: {
            pageNum:num,
            size:10,
            tree_code:code,
            keywords:key
          }
        })
        .then(function(result) {
          if(result.status == 200) {
            vm.loading = false;
            let data = result.data;
            vm.catalogData = data.body;
            if (!data.previous) {
              vm.totalR = data[Pager.totalR];
            }
          }
        })
      },
      getCatalogData(curr_page, search_inp) {
        const vm = this; 
        Http.fetch({
          method: "get",
          url: master + "/home/getDirResourceBriefInfoList",
          params: {
            pageNum: curr_page,
            pageSize: 10,
            keywords: search_inp
          }
        }).then(
          function(result) {
            if (result.status == 200) {
              vm.loading = false;
              let data = result.data;
              vm.catalogData = data.body;
              if (!data.previous) {
                vm.totalR = data[Pager.totalR];
              }
            }
          });
      }, 
      toggleView(showTable) {
        const vm = this;
        vm.showTable = showTable;
      },
      handleCurrentChange(val) {// 点击表格行
        this.currentRow = val;
        this.$router.push({ path: '/layout/catalog/details',
         query: {name:val.dataset_name,pid:val.resource_map_id,setId:val.dataset_id}})
      },
      handlePageChange(val){// 分页处理
        const vm = this;
        vm.currentPage = val;
        if(vm.code){
           vm.loadData(val,vm.code,vm.keywords);
        }else{
           vm.getCatalogData(val, vm.keywords);
        }
       
      },
      // handleSearch(){
      //   const vm = this;
      //   vm.currentPage = 1;
      //   vm.loadData();
      // },
      // clickNode(data){
      //   const vm = this;
      //   vm.loadData(data.treeCode);
      // },
 
    },
    filters:{
        formatDate(time){
          if(!time || time == "无") {
            return "无";
          }
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
        }
    }
};
