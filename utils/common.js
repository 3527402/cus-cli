import fs from 'fs-extra'
import inquirer from 'inquirer'
import gitDownload from 'download-git-repo'
import path from 'path'
import { execSync, spawn } from 'child_process'
// force 为 true 时，处理逻辑
const forceAction = async (proName, options) => {
  try {
    const cwd = process.cwd()
    const targetDir = path.resolve(cwd, proName)
    // 判断目标目录是否存在
    if (fs.existsSync(targetDir)) {
      // 如果force为true，删除已存在的目录
      if (options.force) {
        await fs.remove(targetDir)
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: '文件夹已存在，请选择操作:',
            choices: [
              { name: '覆盖', value: 'overwrite' },
              { name: '取消', value: false },
            ],
          },
        ])
        if (!action) return false
        await fs.remove(targetDir)
      }
    }
    return true
  } catch (e) {
    console.log('forceAction error:', e)
  }
}
// 下载模版
const downloadTemplate = (gitPath, name) => {
  return new Promise((resolve, reject) => {
    try {
      gitDownload(gitPath, name, { clone: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(name)
        }
      })
    } catch (e) {
      console.log('downloadTemplate error:', e)
      reject(e)
    }
  })
}
// 安装依赖
// 不用安装为好，让用户自己确定使用什么包管理器
// 这里只是提供一个事例
const _spawn = (cwd = process.cwd(), name) => {
  const hasYarn = _hasYarn()
  const hasYarnPro = _hasYarnPro()

  spawn(
    hasYarnPro ? (hasYarn ? 'yarn' : 'npx') : 'npm',
    hasYarnPro ? (hasYarn ? [] : ['yarn']) : ['install'],
    {
      stdio: 'inherit',
    }
  ).on('close', () => {
    console.log()
    console.log(`Successfully created project ${chalk.yellowBright(name)}`)
    console.log('Get started with the following commands:')
    console.log()
    console.log(chalk.cyan(`cd ${name}`))
    console.log(chalk.cyan(hasYarnPro ? 'yarn start\r\n' : `npm run serve\r\n`))
  })
}
const _hasYarnPro = (cwd = process.cwd()) => {
  return fs.existsSync(path.join(cwd, 'yarn.lockn'))
}
const _hasYarn = () => {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    console.log('_hasYarn error', e)
    return false
  }
}
export { forceAction, downloadTemplate }
