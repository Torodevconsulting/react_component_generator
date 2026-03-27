import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result",
  result?: unknown
) {
  return { toolName, args, state, result };
}

// str_replace_editor — create
test("shows 'Creating' for str_replace_editor create pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/src/App.jsx" }, "call")}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(screen.queryByText("Created App.jsx")).toBeNull();
});

test("shows 'Created' for str_replace_editor create result", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/src/App.jsx" }, "result", "ok")}
    />
  );
  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

// str_replace_editor — str_replace
test("shows 'Editing' for str_replace_editor str_replace pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/src/Button.tsx" }, "call")}
    />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("shows 'Edited' for str_replace_editor str_replace result", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/src/Button.tsx" }, "result", "ok")}
    />
  );
  expect(screen.getByText("Edited Button.tsx")).toBeDefined();
});

// str_replace_editor — insert
test("shows 'Editing' for str_replace_editor insert pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/src/Button.tsx" }, "call")}
    />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

// str_replace_editor — view
test("shows 'Reading' for str_replace_editor view pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/src/index.ts" }, "call")}
    />
  );
  expect(screen.getByText("Reading index.ts")).toBeDefined();
});

test("shows 'Read' for str_replace_editor view result", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/src/index.ts" }, "result", "ok")}
    />
  );
  expect(screen.getByText("Read index.ts")).toBeDefined();
});

// str_replace_editor — undo_edit
test("shows 'Undoing edit in' for str_replace_editor undo_edit pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/src/App.jsx" }, "call")}
    />
  );
  expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
});

test("shows 'Undid edit in' for str_replace_editor undo_edit result", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/src/App.jsx" }, "result", "ok")}
    />
  );
  expect(screen.getByText("Undid edit in App.jsx")).toBeDefined();
});

// file_manager — rename
test("shows 'Renaming' for file_manager rename pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/src/Old.tsx", new_path: "/src/New.tsx" }, "call")}
    />
  );
  expect(screen.getByText("Renaming Old.tsx")).toBeDefined();
});

test("shows 'Renamed' for file_manager rename result", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/src/Old.tsx", new_path: "/src/New.tsx" }, "result", "ok")}
    />
  );
  expect(screen.getByText("Renamed Old.tsx")).toBeDefined();
});

// file_manager — delete
test("shows 'Deleting' for file_manager delete pending", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/src/Old.tsx" }, "call")}
    />
  );
  expect(screen.getByText("Deleting Old.tsx")).toBeDefined();
});

test("shows 'Deleted' for file_manager delete result", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/src/Old.tsx" }, "result", "ok")}
    />
  );
  expect(screen.getByText("Deleted Old.tsx")).toBeDefined();
});

// Fallback
test("shows raw toolName for unknown tools", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("some_unknown_tool", {}, "call")}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});
