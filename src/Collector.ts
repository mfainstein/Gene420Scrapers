export interface Collector {
    collect(shouldDump?:boolean);
    dump();
}