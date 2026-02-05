#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

// 本地 workspace 包列表
const workspacePackages = ['core', 'utils', 'validator-ajv8', 'snapshot-tests', 'antd', 'chakra-ui', 'daisyui', 'fluentui-rc', 'mantine', 'mui', 'primereact', 'react-bootstrap', 'semantic-ui', 'shadcn'];
const rjsfPackages = ['core', 'utils', 'validator-ajv8'];

console.log('🔗 强制链接本地 workspace 包...\n');

let fixedCount = 0;

// 处理每个包的 node_modules/@rjsf
workspacePackages.forEach(pkgName => {
  const pkgDir = path.join(packagesDir, pkgName);
  const pkgNodeModules = path.join(pkgDir, 'node_modules', '@rjsf');

  if (!fs.existsSync(pkgNodeModules)) {
    return;
  }

  rjsfPackages.forEach(rjsfPkg => {
    const targetDir = path.join(pkgNodeModules, rjsfPkg);
    const sourceDir = path.join(packagesDir, rjsfPkg);

    if (!fs.existsSync(sourceDir)) {
      return;
    }

    // 检查当前是否是符号链接
    const isSymlink = fs.existsSync(targetDir) && fs.lstatSync(targetDir).isSymbolicLink();
    if (isSymlink) {
      const linkTarget = fs.readlinkSync(targetDir);
      const expectedTarget = path.relative(path.dirname(targetDir), sourceDir);

      if (linkTarget === expectedTarget || linkTarget.includes(`../../packages/${rjsfPkg}`)) {
        return; // 已经是正确的链接
      }
    }

    // 检查是否需要替换
    if (fs.existsSync(targetDir)) {
      const pkgJsonPath = path.join(targetDir, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

        // 如果当前安装的不是本地版本，则替换为链接
        if (pkgJson.version && rjsfPkg === 'core' && pkgJson.version !== '6.99.99-fork.3') {
          fs.rmSync(targetDir, { recursive: true, force: true });
          console.log(`  📦 ${pkgName}/node_modules/@rjsf/${rjsfPkg}: 移除 ${pkgJson.version}`);
        } else if (pkgJson.version && rjsfPkg === 'utils' && pkgJson.version !== '6.99.99-fork.1') {
          fs.rmSync(targetDir, { recursive: true, force: true });
          console.log(`  📦 ${pkgName}/node_modules/@rjsf/${rjsfPkg}: 移除 ${pkgJson.version}`);
        }
      }
    }

    // 创建符号链接
    if (!fs.existsSync(targetDir)) {
      const relativePath = path.relative(pkgNodeModules, sourceDir);
      fs.symlinkSync(relativePath, targetDir, 'dir');
      console.log(`  🔗 ${pkgName}/node_modules/@rjsf/${rjsfPkg} -> ../../packages/${rjsfPkg}`);
      fixedCount++;
    }
  });
});

console.log(`\n✅ 完成！修复了 ${fixedCount} 个链接\n`);

// 验证链接
console.log('📋 验证链接状态:');
rjsfPackages.forEach(rjsfPkg => {
  const pkgPath = path.join(packagesDir, rjsfPkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const rootLink = path.join(rootDir, 'node_modules', '@rjsf', rjsfPkg);
    const isLinked = fs.existsSync(rootLink) && fs.lstatSync(rootLink).isSymbolicLink();
    console.log(`  @rjsf/${rjsfPkg}:${pkg.version} ${isLinked ? '✓' : '✗'}`);
  }
});
