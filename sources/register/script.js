import Http from "../common/helper/http.js";
import Encrypt from "../common/helper/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    var validateLoginName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'));

      } else {
        this.getIsUserExist(value).then(
          function (result) {
            if (result.status == 200) {
              let data = result.data;
              if (data) {
                callback(new Error('该用户已存在，请使用其他用户名进行注册'));
              }else{
                callback();
              }
            }
          })
      }
    }
    return {
      disable:false,
      ruleForm: {
        realName: '',
        loginName: '',
        loginPassword: '',
        email: '',
        phoneNumber: ''
      },
      rules: {
        realName: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        loginName: [{
          required: true,
          validator: validateLoginName,
          trigger: 'blur'
        }],
        loginPassword: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }],
        email: [{
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮件地址如：123@qq.com',
            trigger: 'blur,change'
          }
        ],
        phoneNumber: [{
          required: true,
          message: '手机号码不能为空',
          trigger: 'blur'
        }, {
          message: '请输入正确的手机号码',
          pattern: /^(\d{3,4}-)?\d{7,8}$|(^1[3|4|5|7|8]\d{9}$)/,
          trigger: 'blur,change'
        }],
      },
      props: {
        label: 'name',
        children: 'children'
      },
      depData: [],
      depName: ''
    }
  },
  mounted() {
    const vm = this;
  },

  methods: {
    getIsUserExist(name) {
      return Http.fetch({
        method: "get",
        url: master + "/isUserExist",
        params: {
          username: name
        }
      })
    },
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vm.disable=true;
          Http.fetch({
            method: "post",
            url: master + "/home/submitRegisterUerInfo",
            data: {
              realName: vm.ruleForm.realName,
              loginName: vm.ruleForm.loginName,
              loginPassword: Encrypt.md5Encrypt(vm.ruleForm.loginPassword),
              email: vm.ruleForm.email,
              phoneNumber: vm.ruleForm.phoneNumber
            }
          }).then(
            function (result) {
              if (result.status == 200) {
                let data = result.data;
                if (data.result) {
                  vm.$message({
                    showClose: true,
                    message: '提交成功！',
                    type: 'success'
                  });
                  vm.$refs[formName].resetFields(); //清空表单
                  vm.depName = '';
                  vm.$router.push("/login");
                } else {
                  vm.$message({
                    showClose: true,
                    message: '提交失败',
                    type: 'success'
                  });
                }
              }
              vm.disable=false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
