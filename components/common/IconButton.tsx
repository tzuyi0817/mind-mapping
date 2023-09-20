import {
  UndoDot,
  RedoDot,
  Tag,
  Image,
  Trash2,
  ClipboardSignature,
  Link,
  Smile,
  Spline,
  GitBranchPlus,
  GitCommit,
  GitPullRequest,
  Trello,
  FilePlus,
  FolderOpen,
  FolderInput,
  FolderOutput,
  Save,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

const ICON_MAP = {
  UndoDot,
  RedoDot,
  Trash2,
  Image,
  Tag,
  ClipboardSignature,
  Link,
  Smile,
  Spline,
  GitBranchPlus,
  GitCommit,
  GitPullRequest,
  Trello,
  FilePlus,
  FolderOpen,
  FolderInput,
  FolderOutput,
  Save,
} as const;

interface Props {
  icon: keyof typeof ICON_MAP;
  children?: React.ReactNode;
  disabled?: boolean;
}

function IconButton({ icon, children, disabled = false }: Props) {
  const Comp = ICON_MAP[icon];

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="w-full min-w-[40px]"
        disabled={disabled}
      >
        <Comp size={16} />
      </Button>
      <p className={clsx('text-xs whitespace-nowrap', disabled && 'opacity-50')}>{children}</p>
    </div>
  );
}

export default IconButton;
