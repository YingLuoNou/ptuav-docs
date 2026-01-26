// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import path from 'node:path';

function getProductSidebarGroups() {
  const docsPath = path.resolve('./src/content/docs');
  
  // 1. 读取 docs 下的所有一级目录
  const items = fs.readdirSync(docsPath);

  // 2. 过滤出文件夹，并排除不想自动展示的（如 common 或 隐藏文件）
  const productFolders = items.filter((item) => {
    const fullPath = path.join(docsPath, item);
    // 排除 .DS_Store, common 目录，且必须是文件夹
    return fs.statSync(fullPath).isDirectory() && !['common', '.obsidian'].includes(item);
  });

  // 3. 定义文件夹名称到显示名称的映射（可选，如果不定义直接显示文件夹名）
  /** @type {Record<string, string>} */
  const nameMap = {
    'product-a': '旗舰无人机 X1',
    'product-b': '地面站软件 V2',
    // 新增产品时，如果懒得改这里，代码会自动使用文件夹名作为标题
  };

	// 定义显示顺序列表
	const order = ['product1'];

	// 在 return 之前加一行排序逻辑
	productFolders.sort((a, b) => {
		const indexA = order.indexOf(a);
		const indexB = order.indexOf(b);
		// 如果都在列表中，按列表位置排；不在列表中的排在最后
		if (indexA !== -1 && indexB !== -1) return indexA - indexB;
		if (indexA !== -1) return -1;
		if (indexB !== -1) return 1;
		return a.localeCompare(b);
	});

  // 4. 生成 Starlight 需要的数组格式
  return productFolders.map((folder) => {
    return {
      label: nameMap[folder] || folder.toUpperCase(), // 优先用映射名，否则大写文件夹名
      autogenerate: { directory: folder },
      collapsed: true, // 推荐默认折叠，避免侧边栏太长
    };
  });
}

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Phoenixtech Wiki',
			logo: {
				src: './public/logo.png',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: '网站首页',
					link: 'http://192.168.2.110:4321',
				},
				{
					label: '文档首页',
					slug: '',
				},
				...getProductSidebarGroups(),
			],
		}),
	],
});
