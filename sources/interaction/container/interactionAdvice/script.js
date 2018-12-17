import Http from "../../../common/helper/http.js";
import Encrypt from "../../../common/helper/encrypt.js";

const master = Http.url.master;
export default {
  data() {
    var validateCode = (rule, value, callback) => { //自定义验证码规则
      const vm = this;
      if (!value) {
        return callback(new Error('验证码不能为空'));
      } else if (value.toUpperCase() != vm.code.toUpperCase()) {
        return callback(new Error('验证码错误'));
        vm.createCode();
      } else {
        callback();
      }
    };
    return {
      disable:false,
      code: '',
      ruleForm: {
        title: '',
        content: '',
        email: '',
        contactPhone: '',
        inputCode:''
      },
      rules2: {
        inputCode: [{
          validator: validateCode,
           trigger: 'blur'
        }]
      },
    }
  },
  mounted() {
    const vm = this;
    vm.createCode();
  },

  methods: {
    submitForm(formName) {
      const vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vm.disable=true;
          Http.fetch({
            method: "post",
            url: master + "/dirsuggestion/doAdd",
            data: {
              title:vm.ruleForm.title,
              content:vm.ruleForm.content,
              contactEmail:vm.ruleForm.email,
              contactPhone:vm.ruleForm.contactPhone
            }
          }).then(
            function (result) {
              if (result.status == 200) {
                let data = result.data;
                if (data.state) {
                  vm.$message({
                    showClose: true,
                    message: '提交成功！',
                    type: 'success'
                  });
                  vm.$refs[formName].resetFields();//清空表单
                } else {
                  vm.$message({
                    showClose: true,
                    message: '提交失败！',
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
    },
    createCode() {
      // let code = "";
      const vm = this;
      vm.code = "";
      let codeLength = 6; //验证码的长度
      let checkCode = document.getElementById("checkCode");
      let codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
      for (let i = 0; i < codeLength; i++) {
        let charNum = Math.floor(Math.random() * 52);
        vm.code += codeChars[charNum];
      }
      if (checkCode) {
        checkCode.className = "code";
        checkCode.innerHTML = vm.code;
      }
    },

  }
};
