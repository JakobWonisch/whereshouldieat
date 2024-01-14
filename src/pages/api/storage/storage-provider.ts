class StorageProvider {
    
    public static getStorage(): IStorage {
        return StorageMemory.getInstance();
    }

}