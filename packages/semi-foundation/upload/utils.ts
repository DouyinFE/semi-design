export const byteKB = 1024;
export const byteMB = 1048576;

export function getFileSize(number: number): string {
    if (number < byteKB) {
        return `${(number / byteKB).toFixed(2) }KB`;
    } else if (number >= byteKB && number < byteMB) {
        return `${(number / byteKB).toFixed(1) }KB`;
    } else if (number >= byteMB) {
        return `${(number / byteMB).toFixed(1) }MB`;
    }
    return undefined;
}

export function endsWith(str: string, suffix: string): boolean {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export async function loopFiles(item: FileSystemDirectoryEntry): Promise<Array<FileSystemEntry>> {
    return new Promise((res, rej) => {
        const dirReader = item.createReader();
        let fileList: Array<FileSystemEntry> = [];

        function sequence(): void {
            dirReader.readEntries(entries => {
                const entryList = Array.prototype.slice.apply(entries);
                fileList = fileList.concat(entryList);

                // Check if all the file has been viewed
                const isFinished = !entryList.length;

                if (isFinished) {
                    res(fileList);
                } else {
                    sequence();
                }
            }, rej);
        }

        sequence();
    });

}

export async function mapFileTree(items: Array<DataTransferItem>): Promise<Array<File>> {
    const promises: Array<Promise<File>> = [];
    const _traverseFileTree = async (item: FileSystemEntry, path?: string): Promise<void> => {
        path = path || '';
        //@ts-ignore add path property into item
        item.path = path;
        if (item.isFile) {
            promises.push(new Promise((res, rej) => {
                (item as FileSystemFileEntry).file(file => {
                    if (item.fullPath && !file.webkitRelativePath) {
                        // This file is provided to the user based on the relative path of the drag and drop folder
                        // If you drag the Upload folder, the path of the internal file may be Upload/File/a.png, etc
                        Object.defineProperties(file, {
                            webkitRelativePath: {
                                writable: true,
                            },
                        });
                        //@ts-ignore add webkitRelativePath property into file
                        file.webkitRelativePath = item.fullPath.replace(/^\//, '');
                        Object.defineProperties(file, {
                            webkitRelativePath: {
                                writable: false,
                            },
                        });
                    }
                    res(file);
                }, rej);
            }));
        } else if (item.isDirectory) {
            const entries = await loopFiles(item as FileSystemDirectoryEntry);
            for (let index = 0; index < entries.length; index++) {
                const entry = entries[index];
                await _traverseFileTree(entry, `${path}${item.name}/`);
            }
        }
    };
    try {
        const batches = items.map(i => _traverseFileTree(i.webkitGetAsEntry()));
        // Perform asynchronous operations to add the required promises to the queue
        await Promise.all(batches);
        // Execution queue
        const result = await Promise.all(promises);
        return result;
    } catch (error) {
        console.warn('Captured error while loop directory.');
        console.error(error);
        return [];
    }

}