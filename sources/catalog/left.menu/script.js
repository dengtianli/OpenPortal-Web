import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      data2: [],
      data1:[],
      activeName2:"first",
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    const vm = this;
    vm.getList();
  },
  methods: {
    getList: function() {
      const vm = this;
      Http.fetch({
          method: "get",
          url: master + "/home/getClassifyChildrenWithSubchildrenById"
        })
        .then(function(result) {
          if (result.status == 200) {
            if(vm.activeName2 == "first") {
              vm.getNodeById(result.data[1])
            }else{
              let parameter = []; //部门tree需要通过市级部门的id再查询一次
              _.forEach(result.data[2].children,function(n) {
                if(n.type == 3) {
                  parameter.push({
                    code: n.code,
                    icon: n.icon,
                    id: n.id,
                    name: n.name,
                    type: n.type
                  })
                }
              })
              vm.getNodeById(parameter[0]);
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
          if (vm.activeName2 == "first") {
            let array = result.data;
            vm.data2 = [];
            _.forEach(array, function(n, key) {
              vm.data2.push({
                id: n.id,
                name: n.name,
                num: n.subCount,
                treeCode: n.code
              })
            })
          }else {
            // vm.data1 = result.data[0].children;
            let departmentArray = result.data;
            vm.data1 = [];
            _.forEach(departmentArray, function(n,key) {
              vm.data1.push({
                id:n.id,
                name:n.name,
                num: n.subCount,
                treeCode: n.code
              })
            })
          }
        }
      })
    },
    handleClick(data) {
      const vm = this;
      vm.$emit('clicknode',data); 
      console.log(data)
      // vm.$router.push({path: '/layout/catalog/infolist'});
       vm.$router.push({ path: '/layout/catalog/infolist',
          query:{ddcm_code:data.treeCode}})
    },
    // renderContent(h, { node, data, store }) {
    //     return (
    //       <span>
    //         <span>
    //           <span>{node.label}&nbsp;&nbsp;<span class="num">({data.num})</span></span>
    //         </span>
    //       </span>);
    // }
      
  }
};
