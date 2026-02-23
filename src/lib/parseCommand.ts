export function parseCommand(input: string): { name: string; args: string[] } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { name: '', args: [] };
  }
  const parts = trimmed.split(/\s+/);
  return {
    name: parts[0].toLowerCase(),
    args: parts.slice(1),
  };
}
