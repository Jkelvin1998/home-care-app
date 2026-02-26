type LoadingProps = {
   text?: string;
   className?: string;
};

export default function Loading({
   text = 'Checking session...',
   className = 'p-6 text-sm text-slate-600',
}: LoadingProps) {
   return <div className={className}>{text}</div>;
}
