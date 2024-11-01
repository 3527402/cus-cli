import inquirer from 'inquirer'
import chalk from 'chalk'
import logSymbols from 'log-symbols'
import path from 'path'
import ora from 'ora'

import { templateList } from './config.js'
import { forceAction, downloadTemplate } from '../utils/common.js'
export default async (projectName, options) => {
  // 判断目标目录是否存在
  if (!(await forceAction(projectName, options))) {
    return
  }
  // 根据模版创建项目
  try {
    getTemplate(templateList, projectName)
  } catch (e) {
    console.log('create error:', e)
  }
}

// 获取模版
const getTemplate = (config, projectName) => {
  try {
    const choices = Object.keys(config).map((key) => {
      return {
        name: config[key].name,
        value: key,
      }
    })
    const templateTypePrompts = {
      type: 'list',
      message: '请选择项目模版',
      name: 'template', // 存储在answers对象中的属性名
      choices,
      default: 'admin',
    }

    inquirer.prompt(templateTypePrompts).then((answers) => {
      // 选择模版后的操作
      const tempName = answers['template']
      if (!tempName) {
        console.error(logSymbols.error, chalk.red('请选择正确的项目'))
        return
      }

      const gitPath = config[tempName].git
      const name = projectName || path.join(tempName)
      const spinner = ora('正在下载模版...')
      downloadTemplate(gitPath, name)
        .then((res) => {
          spinner.succeed()
          console.log(logSymbols.success, chalk.green('模版下载成功'))
          return res
        })
        .catch((e) => {
          spinner.fail()
          console.log(logSymbols.error, chalk.red('模版下载失败'))
        })
    })
  } catch (e) {
    console.log('getTemplate error:', e)
  }
}
