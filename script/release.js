/* package发布 */

const execa = require('execa')

const release = async () => {
  // 获取已更新的 package
  const lerna_changed_result = await execa('lerna', ['changed'])
  const changedPackages = lerna_changed_result.stdout
  console.log('> ', lerna_changed_result.cmd)
  console.log('*****changed packages:******* \n', changedPackages)

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
  console.log('> ', lerna_exec_result.cmd)
  console.log(lerna_exec_result.stdout)

  // 使用lerna publish发布
  await execa('lerna', ['publish'])
}

release().catch(err => {
  console.log(err)
})