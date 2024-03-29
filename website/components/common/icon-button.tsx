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
import { Button, type ButtonProps } from '@/components/ui/button';

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

interface Props extends ButtonProps {
  icon: keyof typeof ICON_MAP;
}

function IconButton({ icon, children, disabled = false, ...props }: Props) {
  const Comp = ICON_MAP[icon];

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="w-full min-w-[36px] h-9"
        disabled={disabled}
        {...props}
      >
        <Comp size={16} />
      </Button>
      <p className={clsx('text-xs whitespace-nowrap', disabled && 'opacity-50')}>{children}</p>
    </div>
  );
}

export default IconButton;
