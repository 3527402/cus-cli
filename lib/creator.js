import path from 'path'
import fs from 'fs-extra'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import { execSync } from 'child_process'
import inquirer from 'inquirer'
import logSymbols from 'log-symbols'
import config from './config.js'
import ora from 'ora'
import gitDownload from 'download-git-repo'
class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
  }

  create() {
    // 获取项目模版名称
    this.getRepo()
    // this._spawn()
  }
  getRepo() {
    const choices = Object.keys(config).map((key) => {
      return {
        name: config[key].name,
        value: key,
      }
    })
    const templateTypePrompts = {
      type: 'list',
      message: '请选择项目',
      name: 'template', // 存储在answers对象中的属性名
      choices,
      default: 'admin',
    }
    try {
      inquirer.prompt(templateTypePrompts).then((answers) => {
        const tempName = answers['template']
        if (!tempName) {
          console.error(logSymbols.error, chalk.red('请选择正确的项目'))
          return
        }

        const gitPath = config[tempName].git
        const name = path.join(tempName)
        const params = config[tempName].params
        new Promise((resolve, reject) => {
          const spinner = ora('正在下载模板...')
          spinner.start()
          gitDownload(gitPath, name, { clone: true }, (err) => {
            if (err) {
              spinner.fail()
              console.log(logSymbols.error, chalk.red('模板下载失败'))
              reject(err)
            } else {
              spinner.succeed()
              console.log(logSymbols.success, chalk.green('模板下载成功'))
              resolve(name)
            }
          })
        })
          .then((name) => {
            return {
              root: '.',
              name,
            }
          })
          .then((context) => {
            return inquirer.prompt(params).then((answers) => {
              return {
                ...context,
                answers,
              }
            })
          })
          .then((res) => {
            console.log(res)
          })
      })
    } catch (e) {
      console.log(e)
    }
  }

  async _spawn() {
    const isYarnProject = hasYarnProject(this.name)
    const isYarn = hasYarn()
    // 开启子进程安装依赖
    spawn(
      isYarnProject ? (isYarn ? 'yarn' : 'npx') : 'npm', // 选择包管理工具
      isYarnProject ? (isYarn ? [] : ['yarn']) : ['install'], // 安装依赖命令
      {
        stdio: 'inherit',
      }
    ).on('close', () => {
      // close 监听子进程关闭后的回调
      console.log()
      console.log(
        `Successfully created project ${chalk.yellowBright(this.name)}`
      )
      console.log('Get started with the following commands:')
      console.log()
      console.log(chalk.cyan(`cd ${this.name}`))
      console.log(
        chalk.cyan(isYarnProject ? 'yarn start\r\n' : `npm run serve\r\n`)
      )
    })
  }
}

const hasYarnProject = (cwd = process.cwd()) =>
  fs.existsSync(path.resolve(cwd, 'yarn.lock'))

const hasYarn = () => {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (err) {
    return false
  }
}
export default Creator
