const templateList = {
  h5_base: {
    name: 'h5-base',
    git: 'direct:https://github.com/3527402/h5-base.git#main',
    params: [
      {
        name: 'projectName',
        message: '项目的名称',
        default: '基于vue的h5项目',
      },
    ],
  },
}
export { templateList }
// 格式
// xxxx: {
//   name: "xxxxxx",
//   git: "",
//   params: [],
//   paramsFiles: [],
// },
