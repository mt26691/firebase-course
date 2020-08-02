

export function convertSnaps<T>(snaps) {
    return <T[]>snaps.map(snap => {
        return <T>{
            id: snap.payload.doc.id,
            ...(snap.payload.doc.data() as any)
        };
    });
}