'use client';

import IconButton from '@/components/common/icon-button';
import styles from '@/styles/toolbar.module.css';
import { useMindMapping } from '@/providers/mind-mapping';

function Toolbar() {
  const { instance } = useMindMapping();

  function handleInsertNode() {
    instance.current?.command.execute('INSERT_NODE');
  }

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 flex gap-5">
      <div className={styles.toolbarBlock}>
        <IconButton icon="UndoDot">上一步</IconButton>
        <IconButton icon="RedoDot">下一步</IconButton>
        <IconButton icon="GitCommit">格式化</IconButton>
        <IconButton
          icon="GitBranchPlus"
          onClick={handleInsertNode}
        >
          插入同級節點
        </IconButton>
        <IconButton icon="GitPullRequest">插入子節點</IconButton>
        <IconButton icon="Trash2">刪除節點</IconButton>
        <IconButton icon="Image">圖片</IconButton>
        <IconButton icon="Smile">圖標</IconButton>
        <IconButton icon="Link">超連結</IconButton>
        <IconButton icon="ClipboardSignature">備註</IconButton>
        <IconButton icon="Tag">標籤</IconButton>
        <IconButton icon="Trello">大綱</IconButton>
        <IconButton icon="Spline">關聯線</IconButton>
      </div>
      <div className={styles.toolbarBlock}>
        <IconButton icon="FilePlus">新建</IconButton>
        <IconButton icon="FolderOpen">打開</IconButton>
        <IconButton icon="Save">另存為</IconButton>
        <IconButton icon="FolderInput">導入</IconButton>
        <IconButton icon="FolderOutput">導出</IconButton>
      </div>
    </div>
  );
}

export default Toolbar;
