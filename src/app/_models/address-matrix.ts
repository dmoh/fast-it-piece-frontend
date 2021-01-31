
export class AddressMatrix {

    
    street : string;
    city : string;
    zipCode : string;
    
    public setStreet(street : string): AddressMatrix {
        this.street = street;
        return this;
    }

    public setCity(city : string) {
        this.city = city;
        return this;
    }

    public setZipCode(zipCode : string) {
        this.zipCode = zipCode;
        return this;
    }
    
    
}