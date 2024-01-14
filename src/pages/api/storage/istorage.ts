interface IStorage {
    
    storeBusinesses(businesses: Business[]): void;
    getBusiness(id: string): Business;

}