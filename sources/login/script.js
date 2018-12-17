import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
export default {
  data() {
    return {
      username: "",
      password: "",
      errorShow: false,
      ischecked:false
    }
  },
  mounted() {
    const vm = this;
    vm.getCookie();
  },
  methods: {
    onSubmit() {
      const vm = this;
      console.log(vm.ischecked)
      if(vm.ischecked == true) {
        vm.setCookie(vm.username,vm.password,7)
      }
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
            Encrypt.token.set("orgName", data.orgName);
            Encrypt.token.set("userName", data.userName);
            vm.$router.push("/dashboard");
          } else {
            vm.errorShow = true;
          }
        })
    },
    //设置cookie
    setCookie(c_name,c_pwd,exdays) {
      var exdate=new Date();//获取时间
      exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数
      //字符串拼接cookie
      window.document.cookie="username"+ "=" +c_name+";path=/;expires="+exdate.toGMTString();
      window.document.cookie="password"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
    },
    //读取cookie
    getCookie:function () {
      const vm = this;
      if (document.cookie.length>0) {
        var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
        for(var i=0;i<arr.length;i++){
          var arr2=arr[i].split('=');//再次切割
          //判断查找相对应的值
          if(arr2[0]=='username'){
            vm.username=arr2[1];//保存到保存数据的地方
          }else if(arr2[0]=='password'){
            vm.password=arr2[1];
          }
        }
      }
    },
    keydownLogin(ev) {
      const vm = this;
      var event = ev || window.event;
      if (event.keyCode == '13') { //keyCode=13是回车键
        vm.onSubmit();
      }
    }
  }
};
