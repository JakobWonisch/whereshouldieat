class StorageMemory implements IStorage {

    private static instance: IStorage;

    private businesses: Map<string, Business>;

    private constructor() {
        this.businesses = new Map<string, Business>();
    }

    public static getInstance(): IStorage {
        if(!StorageMemory.instance) {
            StorageMemory.instance = new StorageMemory();
        }

        return StorageMemory.instance;
    }

    storeBusinesses(businesses: Business[]): void {
        for(const business of businesses) {
            this.businesses.set(business.id, business);
        }
    }

    getBusiness(id: string) {
        return this.businesses.get(id);
    }

}