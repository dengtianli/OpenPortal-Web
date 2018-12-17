import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
import jquery from "jquery";
import QRCode from "qrcodejs2"

const master = Http.url.master;

export default {
  data() {
    return {
      activeName: "",
      activeChild: '',
      devthemes: {},
      data1: [],
      current_item: {},
      istextaDep: true,
      showLinkDom: false,
      jumpRoute: true,
      urlCode: "", //二维码
    }
  },
  mounted() {
    const vm = this;
    vm.getRemoteDatas();
    setTimeout(function () {
      vm.qrcode('qrcode0');
    }, 1000);
  },
  methods: {
    handleClick(item, event) {
      const vm = this;
      vm.current_item = item;
      vm.activeChild = item.name;
      vm.showLinkDom = false;
      Http.fetch({
        method: "GET",
        url: master + "/home/getAppsByDept",
        params: {
          pid: event
        }
      }).then(
        function (result) {
          if (result.status == 200) {
            vm.data1 = result.data.rs.aaData;
          }
        });
    },
    getRemoteDatas: function () {
      const vm = this;
      Http.fetch({
        method: "GET",
        url: master + "/home/getThematicAppData",
      }).then(
        function (result) {
          if (result.status == 200) {
            let themeApplicationsdata = result.data.rs.aaData;
            vm.devthemes = themeApplicationsdata;
            var param_item = vm.$route.query.current_item;
            vm.activeName = themeApplicationsdata[0].name;
            if (param_item) {
              vm.current_item = param_item;
              vm.showLinkDom = true;
              vm.jumpRoute = false;
              $(".el-tabs__item").removeClass("is-active");
            } else {
              vm.current_item = themeApplicationsdata[0].children[0].children[0];
              vm.urlCode = vm.current_item.url;
              vm.showLinkDom = true;
            }
          }
        });
    },
    showLink: function (item, val, index) {
      const vm = this;
      if (val != 'dep') {
        vm.activeChild = "";
      }
      vm.current_item = item;
      vm.urlCode = vm.current_item.url;
      vm.showLinkDom = true;
      $("#qrcode" + index).html('');
      vm.qrcode('qrcode' + index);
    },
    changeTab: function () {
      const vm = this;
      vm.activeChild = '';
      _.forEach(vm.devthemes, function (_item, index) {
        if (vm.activeName == _item.name) {
          vm.current_item = _item.children[0].children[0];
          vm.urlCode = vm.current_item.url;
          $("#qrcode" + index).html('');
          vm.qrcode('qrcode' + index);
        }
      })
      vm.showLinkDom = true;
      vm.jumpRoute = true;
    },
    // 生成二维码
    qrcode: function (ele) {
      const vm = this;
      // 简单方式
      // new QRCode(document.getElementById('qrcode'), 'your content');

      // 设置参数方式
      var qrcode = new QRCode(ele, {
        text: vm.urlCode,
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      // 使用 API
      // qrcode.clear();
      // qrcode.makeCode(vm.urlCode);
    }
  },
};
