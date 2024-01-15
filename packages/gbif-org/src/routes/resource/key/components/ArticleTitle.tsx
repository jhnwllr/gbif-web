import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

export function ArticleTitle({ title, children, className }: Props) {
  return (
    <h1
      className={cn(
        'text-2xl md:text-3xl inline-block sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200',
        className
      )}
    >
      {title && <span dangerouslySetInnerHTML={{ __html: title }} />}
      {children}
    </h1>
  );
}
