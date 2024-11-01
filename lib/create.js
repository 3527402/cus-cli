import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import Creator from './creator.js'

export default async (projectName, options) => {
  console.log('projectName', projectName)
  console.log('options', options)
  const cwd = process.cwd() // 获取当前工作目录
  const targetDir = path.resolve(cwd, projectName) // 获取目标目录
  // 判断目标目录是否存在
  console.log('targetDir', targetDir)
  if (fs.existsSync(targetDir)) {
    console.log('fs.existsSync(targetDir)', fs.existsSync(targetDir))
    if (options.force) {
      // 如果force为true，删除已存在的目录
      await fs.remove(targetDir)
    } else {
      console.log(`\n${targetDir} already exists.\n`)
      // 如果force为false，询问用户是否删除已存在的目录
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false },
          ],
        },
      ])
      console.log(!action)
      if (!action) return
      await fs.remove(targetDir)
    }
  }
  // 创建项目
  const creator = new Creator(projectName, targetDir)
  creator.create()
}
