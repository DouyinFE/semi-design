/**
 * Escape HTML angle brackets in markdown text, preserving code blocks and inline code.
 * 
 * In `format='md'` mode, @mdx-js/mdx uses `rehypeRemoveRaw` which strips all raw HTML nodes.
 * This causes user-typed HTML-like content (e.g. `<AgentChat />`) to silently disappear.
 * By escaping `<` to `&lt;` outside of code spans/blocks, the markdown parser treats them
 * as literal text instead of HTML tags.
 */
export function escapeHtmlInMarkdown(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    let fenceChar: string | null = null;
    let fenceLen = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (fenceChar !== null) {
            // Inside a fenced code block — check for closing fence
            result.push(line);
            const trimmed = line.trimEnd();
            if (
                trimmed.length >= fenceLen &&
                trimmed[0] === fenceChar &&
                trimmed === fenceChar.repeat(trimmed.length)
            ) {
                fenceChar = null;
            }
        } else {
            // Check if this line opens a fenced code block
            const fenceMatch = line.match(/^(`{3,}|~{3,})/);
            if (fenceMatch) {
                fenceChar = fenceMatch[1][0];
                fenceLen = fenceMatch[1].length;
                result.push(line);
            } else {
                result.push(escapeAngleBracketsOutsideInlineCode(line));
            }
        }
    }

    return result.join('\n');
}

/**
 * Escape `<` to `&lt;` in a single line, but preserve content inside inline code spans.
 */
function escapeAngleBracketsOutsideInlineCode(line: string): string {
    const parts: string[] = [];
    let i = 0;

    while (i < line.length) {
        if (line[i] === '`') {
            // Count opening backticks
            let count = 0;
            const start = i;
            while (i < line.length && line[i] === '`') {
                count++;
                i++;
            }
            // Find matching closing backticks (exact same count)
            const closer = '`'.repeat(count);
            const closeIdx = line.indexOf(closer, i);
            if (closeIdx !== -1) {
                parts.push(line.slice(start, closeIdx + count));
                i = closeIdx + count;
            } else {
                // No matching close — treat backticks as regular text, escape any `<`
                parts.push(line.slice(start, i).replace(/</g, '&lt;'));
            }
        } else if (line[i] === '<') {
            parts.push('&lt;');
            i++;
        } else {
            // Collect a run of non-special characters at once
            const next = line.indexOf('<', i);
            const nextBt = line.indexOf('`', i);
            let end: number;
            if (next === -1 && nextBt === -1) {
                end = line.length;
            } else if (next === -1) {
                end = nextBt;
            } else if (nextBt === -1) {
                end = next;
            } else {
                end = Math.min(next, nextBt);
            }
            parts.push(line.slice(i, end));
            i = end;
        }
    }

    return parts.join('');
}
