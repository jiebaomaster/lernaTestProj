/* 使用模版项目，创建一个新的 package */
const execa = require('execa')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const log = console.log

const packageName = process.argv[2]
if (!packageName) {
  log(chalk.bold.red('必须提供 package 名称！'))
  return
}
const [scopeName, dirname] = packageName.split('/')

const newPackage = async () => {
  // 校验包的名称是否已存在
  const lerna_changed_result = await execa('lerna', ['list'])
  if (lerna_changed_result.stdout.split('\n').includes(packageName)) {
    log(chalk.bold.red('已存在相同名称的 package！'))
    return
  }

  // 拷贝模版项目到 packages 文件夹下
  log('开始拷贝模版项目...')
  await fs.copy(path.resolve(__dirname, './template_package'), path.resolve(__dirname, `../packages/${dirname}`))
  log(chalk.blue('拷贝模版项目成功'))

  // 修改新建的 package 文件夹中的需要修改地方
  // 1. package.json 中项目名称
  const jsonPath = path.resolve(__dirname, `../packages/${dirname}/package.json`)
  const packageJson = await fs.readJson(jsonPath)
  packageJson.name = packageName
  await fs.writeJSON(jsonPath, packageJson, {spaces: 2})
  log(chalk.blue(`自定义 ${packageName} 文件成功`))

  // 安装依赖
  log('开始安装依赖...')
  await execa('npm', ['run', 'bootstrap'])
  log(chalk.blue('依赖安装成功'))
  log(chalk.bold.green('新建 package 成功！'))
}

newPackage().catch(err => {
  log(err)
})