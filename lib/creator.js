import path from 'path'
import fs from 'fs-extra'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import { execSync } from 'child_process'

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
  }

  async create() {
    // 获取项目模版名称
    const repo = await this.getRepo()
    console.log('repo', repo)
    this._spawn()
    // 获取版本号
    // const tag = await this.getTag(repo)
    // // 下载模版
    // await this.download(repo, tag) 测试
  }
  async getRepo() {
    // 获取模版
    return 'adfs'
  }
  async _spawn() {
    const isYarnProject = hasYarnProject(this.name)
    const isYarn = hasYarn()
    console.log(process.platform, 'process.platform')
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
