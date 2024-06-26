import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ArticleContainer({ className, children }: Props) {
  return (
    <article
      className={cn('p-4 lg:pt-8 lg:px-8 dark:bg-zinc-900 dark:text-slate-200', className)}
    >
      {children}
    </article>
  );
}
