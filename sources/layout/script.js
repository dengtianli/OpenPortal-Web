import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      islogin: false,
      username: "",
      password: "",
      dialogLoginVisible: false,
      errorShow:false
    }
  },
  mounted() {
    const vm = this;
    vm.isloginStatus();
  },

  methods: {
    /**登录状态 */
    isloginStatus() {
      const vm = this;
      let name = Encrypt.token.get("userName");
      vm.username = name;
      if (name) {
        vm.islogin = true;
      }
    },
    /**退出登录 */
    loginOut: function () {
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
    onSubmit() {
      const vm = this;
      Http.fetch({
          method: "get",
          url: Http.url.master + "/login",
          params: {
            username: vm.username,
            password: Encrypt.md5Encrypt(vm.password)
          }
        })
        .then(function (result) {
          if (result.status == 200 && result.data.userName) {
            const data = result.data;
            vm.$message({
                  showClose: true,
                  message: '登录成功！',
                  type: 'success'
                });
            vm.dialogLoginVisible = false;
            vm.islogin = true;
            Encrypt.token.set("orgName", data.orgName);
            Encrypt.token.set("userName", data.userName);
             vm.$router.push({path:vm.$route.fullPath, query: {
        t: + new Date()
    }})

          } else {
            vm.errorShow = true;
          }
        })
    },
      openLoginDialog: function () {
      this.dialogLoginVisible = true;
    },
  }
};
