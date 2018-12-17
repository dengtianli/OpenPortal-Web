import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      keywords: '',
      currentCode: this.$route.query.dirCode,
      baseData: [],
      topicData: [],
      depData: [],
      activeName2: "first",
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showSearchDiv: true,
      departmentCount: "", //已开放部门数
      directoryCount: "" //数据集
    }
  },
  mounted() {
    const vm = this;
    vm.getCatalogList();
    vm.getList(false);
    if (vm.$route.path == '/layout/catalog') {
      vm.$router.push({
        path: '/layout/catalog/resource'
      })
    }
  },
  methods: {
    showDiv(val) {
      if (val) {
        this.showSearchDiv = true;
      } else {
        this.showSearchDiv = false;
      }

    },
    getList: function (cache_route) {
      const vm = this;
      Http.fetch({
          method: "get",
          url: master + "/home/getClassifyChildrenWithSubchildrenById"
        })
        .then(function (result) {
          if (result.status == 200) {
            _.forEach(result.data, function (_item) {
              if (vm.activeName2 == 'three' && _item.type == '2-3') {
                _.forEach(_item.children, function (depItem) {
                  if (depItem.name == '市级部门') {
                    vm.getNodeById(depItem);
                  }
                })
              } else {
                if (_item.type == '2-1') {
                  vm.baseData = _item.children;
                } else if (_item.type == '2-2') {
                  vm.topicData = _item.children;
                }
              }
            })
          }
        })
      if (cache_route) {
        vm.keywords = '';
        vm.currentCode = '';
        vm.$router.push({
          path: '/layout/catalog/resource',
        })
      }
    },
    getNodeById: function (item) {
      const vm = this;
        Http.fetch({
            method: "get",
            url: master + "/home/getClassifyChildrenWithSubchildrenById",
            params: {
              id: item.id
            }
          })
          .then(function (result) {
            if (result.status == 200) {
              _.forEach(result.data, function (n, key) {
                vm.depData.push({
                  id: n.id,
                  name: n.name,
                  num: n.subCount,
                  code: n.code
                })
              })
            }
          })
      
    },
    handleClick(data) {
      const vm = this;
      vm.currentCode = data.code;
      vm.keywords = '';
      vm.$router.push({
        path: '/layout/catalog/resource',
        query: {
          dirCode: data.code
        }
      })
    },
    searchRoute() {
      const vm = this;
      vm.$router.push({
        path: '/layout/catalog/resource',
        query: {
          dirCode: vm.currentCode,
          keywords: vm.keywords
        }
      })
    },
    getCatalogList: function () { // 头部数据项
      const vm = this;
      Http.fetch({
          method: "get",
          url: Http.url.master + "/home/countDataShareSituation"
        })
        .then(function (result) {
          if (result.status == 200) {
            vm.departmentCount = result.data.departmentCount;
            vm.directoryCount = result.data.directoryCount;
          }
        })
    }
    // renderContent(h, { node, data, store }) {
    //     return (
    //       <span>
    //         <span>
    //           <span>{node.label}&nbsp;&nbsp;<span class="num">({data.num})</span></span>
    //         </span>
    //       </span>);
    // }

  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
    }
  },
};
