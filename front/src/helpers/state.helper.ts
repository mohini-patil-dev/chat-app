export function emptyState<T>(obj: T): T {
    const emptyObject: any = {};
    for (const key in obj) {
        emptyObject[key] = '';
    }
    return emptyObject;
}

interface IMoveArray {
    arr: any[];
    from: number;
    to: number;
}

export function moveArray({ arr, from, to }: IMoveArray): any[] {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
}
