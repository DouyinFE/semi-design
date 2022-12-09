// Modified version based on 'highlight-words-core'
import { isString } from 'lodash';

const escapeRegExpFn = (string: string) => string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
interface ChunkQuery {
    autoEscape?: boolean;
    caseSensitive?: boolean;
    searchWords: string[];
    sourceString: string
}
interface Chunk {
    start: number;
    end: number;
    highlight: boolean
}
/**
   * Examine text for any matches.
   * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
   * @return { start:number, end:number }[]
   */
const findChunks = ({
    autoEscape,
    caseSensitive,
    searchWords,
    sourceString
}: ChunkQuery): Chunk[] => (
    searchWords
        .filter(searchWord => searchWord) // Remove empty words
        .reduce((chunks, searchWord) => {
            if (autoEscape) {
                searchWord = escapeRegExpFn(searchWord);
            }
            const regex = new RegExp(searchWord, caseSensitive ? 'g' : 'gi');

            let match;
            while ((match = regex.exec(sourceString))) {
                const start = match.index;
                const end = regex.lastIndex;
                // We do not return zero-length matches
                if (end > start) {
                    chunks.push({ highlight: false, start, end });
                }
                // Prevent browsers like Firefox from getting stuck in an infinite loop
                // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
            }
            return chunks;
        }, [])
);

/**
   * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
   * @return {start:number, end:number}[]
   */
const combineChunks = ({ chunks }: { chunks: Chunk[] }) => {
    chunks = chunks
        .sort((first, second) => first.start - second.start)
        .reduce((processedChunks, nextChunk) => {
        // First chunk just goes straight in the array...
            if (processedChunks.length === 0) {
                return [nextChunk];
            } else {
                // ... subsequent chunks get checked to see if they overlap...
                const prevChunk = processedChunks.pop();
                if (nextChunk.start <= prevChunk.end) {
                    // It may be the case that prevChunk completely surrounds nextChunk, so take the
                    // largest of the end indeces.
                    const endIndex = Math.max(prevChunk.end, nextChunk.end);
                    processedChunks.push({
                        highlight: false,
                        start: prevChunk.start,
                        end: endIndex
                    });
                } else {
                    processedChunks.push(prevChunk, nextChunk);
                }
                return processedChunks;
            }
        }, []);

    return chunks;
};


/**
   * Given a set of chunks to highlight, create an additional set of chunks
   * to represent the bits of text between the highlighted text.
   * @param chunksToHighlight {start:number, end:number}[]
   * @param totalLength number
   * @return {start:number, end:number, highlight:boolean}[]
   */
const fillInChunks = ({ chunksToHighlight, totalLength }: { chunksToHighlight: Chunk[]; totalLength: number }) => {
    const allChunks: Chunk[] = [];
    const append = (start: number, end: number, highlight: boolean) => {
        if (end - start > 0) {
            allChunks.push({
                start,
                end,
                highlight
            });
        }
    };

    if (chunksToHighlight.length === 0) {
        append(0, totalLength, false);
    } else {
        let lastIndex = 0;
        chunksToHighlight.forEach(chunk => {
            append(lastIndex, chunk.start, false);
            append(chunk.start, chunk.end, true);
            lastIndex = chunk.end;
        });
        append(lastIndex, totalLength, false);
    }
    return allChunks;
};


/**
 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
 *
    findAll ['z'], 'aaazaaazaaa'
        result #=> [
            { start: 0, end: 3, highlight: false }
            { start: 3, end: 4, highlight: true }
            { start: 4, end: 7, highlight: false }
            { start: 7, end: 8, highlight: true }
            { start: 8, end: 11, highlight: false }
        ]

    findAll ['do', 'dollar'], 'aaa do dollar aaa'
        #=> chunks: [
                { start: 4, end: 6 },
                { start: 7, end: 9 },
                { start: 7, end: 13 },
            ]
        #=> chunksToHight: [
                { start: 4, end: 6 },
                { start: 7, end: 13 },
            ]
        #=> result: [
                { start: 0, end: 4, highlight: false },
                { start: 4, end: 6, highlight: true },
                { start: 6, end: 7, highlight: false },
                { start: 7, end: 13, highlight: true },
                { start: 13, end: 17, highlight: false },
            ]

 * @return Array of "chunks" (where a Chunk is { start:number, end:number, highlight:boolean })
 */

const findAll = ({
    autoEscape = true,
    caseSensitive = false,
    searchWords,
    sourceString
}: ChunkQuery) => {
    if (isString(searchWords)) {
        searchWords = [searchWords];
    }

    const chunks = findChunks({
        autoEscape,
        caseSensitive,
        searchWords,
        sourceString
    });
    const chunksToHighlight = combineChunks({ chunks });
    const result = fillInChunks({
        chunksToHighlight,
        totalLength: sourceString ? sourceString.length : 0
    });
    return result;
};

export { findAll };