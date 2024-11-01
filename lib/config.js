export default {
  vue_cli: {
    name: 'vue-cli的一些配置',
    git: 'direct:https://github.com/3527402/VUECLI#main',
    params: [
      {
        name: 'projectName',
        message: '项目的名称',
        default: '基于vue的PC端项目',
      },
    ],
    paramsFiles: [],
  },
}

// 格式
// xxxx: {
//   name: "xxxxxx",
//   git: "",
//   params: [],
//   paramsFiles: [],
// },
