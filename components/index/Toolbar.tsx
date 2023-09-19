import IconButton from '@/components/common/IconButton';

function Toolbar() {
  return (
    <div className="flex px-4 py-2 rounded shadow w-fit bg-secondary-DEFAULT gap-3 fixed top-5 left-1/2 -translate-x-1/2">
      <IconButton icon="UndoDot">上一步</IconButton>
      <IconButton icon="RedoDot">下一步</IconButton>
      <IconButton icon="GitCommit">格式化</IconButton>
      <IconButton icon="GitBranchPlus">插入同級節點</IconButton>
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
  );
}

export default Toolbar;
