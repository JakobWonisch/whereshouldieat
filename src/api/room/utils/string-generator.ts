class StringGenerator {

    // credit to: https://stackoverflow.com/a/1349426
    public static generate(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        let result = "";
        
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        return result;
    }

}

export default StringGenerator;