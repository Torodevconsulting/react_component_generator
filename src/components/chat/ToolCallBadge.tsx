"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolInvocation: {
    toolName: string;
    args: Record<string, unknown>;
    state: string;
    result?: unknown;
  };
}

function getLabel(toolName: string, args: Record<string, unknown>, isDone: boolean): string {
  const fileName = typeof args.path === "string" ? args.path.split("/").pop() : undefined;
  const command = args.command as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return isDone ? `Created ${fileName}` : `Creating ${fileName}`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${fileName}` : `Editing ${fileName}`;
      case "view":
        return isDone ? `Read ${fileName}` : `Reading ${fileName}`;
      case "undo_edit":
        return isDone ? `Undid edit in ${fileName}` : `Undoing edit in ${fileName}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return isDone ? `Renamed ${fileName}` : `Renaming ${fileName}`;
      case "delete":
        return isDone ? `Deleted ${fileName}` : `Deleting ${fileName}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const isDone = toolInvocation.state === "result" && toolInvocation.result != null;
  const label = getLabel(toolInvocation.toolName, toolInvocation.args, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
