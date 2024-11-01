#! /usr/bin/env node
import chalk from 'chalk'
import create from '../lib/create.js'
import { program } from 'commander'

// 创建命令
program
  .command('create <project>')
  .description('create a new project')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, options) => {
    create(name, options)
  })

// 监听到help命令：my-cli --help时会调用回调函数
program.on('--help', () => {
  // 空打印相当于换行
  console.log()
  console.log(
    `Run ${chalk.cyan(
      'my-cli <command> --help'
    )} for detailed usage of given command.`
  )
  console.log()
})

// 解析进程中的参数
program.parse(process.argv)
