
export class AddressMatrix {

    
    street : string;
    city : string;
    zipcode : string;
    
    public setStreet(street : string): AddressMatrix {
        this.street = street;
        return this;
    }

    public setCity(city : string) {
        this.city = city;
        return this;
    }

    public setZipCode(zipCode : string) {
        this.zipcode = zipCode;
        return this;
    }
    
    
}