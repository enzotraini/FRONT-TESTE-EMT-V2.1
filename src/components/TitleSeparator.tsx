import { Separator } from "@/components/ui/separator";

interface TitleSeparatorProps {
	title: string;
	children?: React.ReactNode;
}

export function TitleSeparator({ title, children }: TitleSeparatorProps) {
	return (
		<div className="flex items-center gap-x-2">
			<Separator className="w-[40px]" />
			{children ?? <h2>{title}</h2>}
			<Separator className="flex-1" />
		</div>
	);
}
