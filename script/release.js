/* package发布 */

const execa = require('execa')
const chalk = require('chalk')
const log = console.log

const release = async () => {
  // 获取已更新的 package
  const lerna_changed_result = await execa('lerna', ['changed'])
  const changedPackages = lerna_changed_result.stdout
  log(chalk.bold.blue(`> ${lerna_changed_result.cmd}`))
  log(chalk.bold('*************changed packages:************* \n'), changedPackages)

  // 给每个已更新的包运行 npm run build 命令，打包  
  let scope = changedPackages.split('\n').join(',--scope,').split(',')
  scope.unshift('--scope')
  let lerna_exec_result = await execa('lerna', [
    'exec',
    ...scope,
    '--',
    'npm',
    'run',
    'build'
  ])
  log(chalk.bold.blue(`> ${lerna_exec_result.cmd}`))
  log(lerna_exec_result.stdout)
  log(chalk.bold.blue(`> lerna publish`))
}

release().catch(err => {
  log(err)
})