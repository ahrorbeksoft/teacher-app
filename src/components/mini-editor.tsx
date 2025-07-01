"use client";

import { Button } from "@/components/extendui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Bold, Italic, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MiniEditorProps {
	defaultValue?: string;
	className?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	minHeight?: string;
}

export function MiniEditor({
	defaultValue = "<p>Type here...</p>",
	onChange,
	minHeight = "150px",
	className,
}: MiniEditorProps) {
	const [value, setValue] = useState(defaultValue);
	const editorRef = useRef<HTMLDivElement>(null);
	const initializedRef = useRef(false);

	// Set initial content only once
	useEffect(() => {
		if (!initializedRef.current && editorRef.current) {
			editorRef.current.innerHTML = defaultValue;
			initializedRef.current = true;
		}
	}, [defaultValue]);

	const exec = (command: string) => {
		document.execCommand(command, false);
		editorRef.current?.focus();
		const newValue = editorRef.current?.innerHTML || "";
		setValue(newValue);
		onChange?.(newValue);
	};

	const handleInput = () => {
		const newValue = editorRef.current?.innerHTML || "";
		setValue(newValue);
		onChange?.(newValue);
	};

	return (
		<Card className={cn("overflow-hidden border border-input p-0 gap-0", className)}>
			{/* Toolbar */}
			<div className="flex items-center gap-1 border-b bg-muted/50 px-3 py-1">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={() => exec("bold")}
								aria-label="Bold"
							>
								<Bold className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Bold</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={() => exec("italic")}
								aria-label="Italic"
							>
								<Italic className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Italic</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={() => exec("insertUnorderedList")}
								aria-label="Bullet List"
							>
								<List className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Bullet List</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Editable Div */}
			{/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
			<div
				ref={editorRef}
				contentEditable
				id="editor"
				onInput={handleInput}
				className={cn(
					"prose prose-sm max-w-none px-3 py-2 focus:outline-none",
					"min-h-[150px]",
					"scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300",
					"overflow-y-auto",
				)}
				style={{ minHeight }}
				suppressContentEditableWarning
				aria-multiline="true"
				role="textbox"
			/>
		</Card>
	);
}
