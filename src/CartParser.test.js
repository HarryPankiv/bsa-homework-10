import CartParser from './CartParser';

let parse, validate, content;
beforeEach(() => {
    let parser = new CartParser();
    parse = parser.parse;
    validate = parser.validate.bind(parser);
    content = parser.readFile('./samples/cart.csv');
});

describe("CartParser validation method tests", () => {
    // Add your unit tests here.

    it('Should return [] if csv file is valid', () => {
        expect(validate(content)).toEqual([]);
    });

    it('Should return err if header undefined', () => {
        // csv file content with wrong header
        let wrongHeader = 'Product name,Price\n' +
            'Condimentum aliquet,13.90,1';

        // err that should be expected
        let err = {
            "column": 2,
            "message": "Expected header to be named \"Quantity\" but received undefined.",
            "row": 0,
            "type": "header",
        };
        expect(validate(wrongHeader)).toEqual([err]);
    });

    it('Should return err if there is negative number in csv', () => {
        // content with negative number
        let wrongContent = 'Product name,Price,Quantity\n' +
            'Mollis consequat,9.00,-2';
        // err that should be expected
        let err = {
            "column": 2,
            "message": "Expected cell to be a positive number but received \"-2\".",
            "row": 1,
            "type": "cell",
        };
        expect(validate(wrongContent)).toEqual([err]);
    });

    it('Should return err if there is not appropriate amount of cells', () => {
        let wrongContent = 'Product name,Price,Quantity\n' +
            'Mollis consequat,2';
        let err = {
            "column": -1,
            "message": "Expected row to have 3 cells but received 2.",
            "row": 1,
            "type": "row",
        };
        expect(validate(wrongContent)).toEqual([err]);
    });

    it('Should return err if there is empty cell string', () => {
        let wrongContent = 'Product name,Price,Quantity\n' +
            ',13.90,1';
        let err = {
            "column": 0,
            "message": "Expected cell to be a nonempty string but received \"\".",
            "row": 1,
            "type": "cell",
        };
        expect(validate(wrongContent)).toEqual([err]);
    });

    it('Should return all errors if csv file is invalid ', () => {
        let wrongContent = 'Product name,Quantit\n' +
            'Mollis consequat,2\n' +
            'Tvoluptatem,10.32,-1\n' +
            ',18.90,1';
        let err = [
            {
                "column": 1,
                "message": "Expected header to be named \"Price\" but received Quantit.",
                "row": 0,
                "type": "header",
            },
            {
                "column": 2,
                "message": "Expected header to be named \"Quantity\" but received undefined.",
                "row": 0,
                "type": "header",
            },
            {
                "column": -1,
                "message": "Expected row to have 3 cells but received 2.",
                "row": 1,
                "type": "row",
            },
            {
                "column": 2,
                "message": "Expected cell to be a positive number but received \"-1\".",
                "row": 2,
                "type": "cell",
            },
            {
                "column": 0,
                "message": "Expected cell to be a nonempty string but received \"\".",
                "row": 3,
                "type": "cell",
            },
        ];
        expect(validate(wrongContent)).toEqual(err);
    });
    
    it("Should return err if total doesn't match price sum", () => {
        let parser = new CartParser();
        let json = parser.readFile('./samples/cart.json');
        let data = [{
            "id": "3e6def17-5e87-4f27-b6b8-ae78948523a9",
            "name": "Mollis consequat",
            "price": 9,
            "quantity": 2
        },
        {
            "id": "90cd22aa-8bcf-4510-a18d-ec14656d1f6a",
            "name": "Tvoluptatem",
            "price": 10.32,
            "quantity": 1
        },
        {
            "id": "33c14844-8cae-4acd-91ed-6209a6c0bc31",
            "name": "Scelerisque lacinia",
            "price": 18.9,
            "quantity": 1
        }]

        let jsondata = JSON.parse(json).items;
        let jsontotal = JSON.parse(json).total;
        expect(jsontotal).toBeCloseTo(parser.calcTotal(jsondata));
        expect(parser.calcTotal(data)).toBeCloseTo(47.22);
    })
    
    it("Should return err if id is invalid", () => {
        let parser = new CartParser();
        let json = JSON.parse(parser.readFile('./samples/cart.json')).items;
        let args = json[0].id.split('-');
        expect(args.length).toEqual(5);
        expect(args[0].length).toEqual(8);
        expect(args[1].length).toEqual(4);
        expect(args[2].length).toEqual(4);
        expect(args[3].length).toEqual(4);
        expect(args[4].length).toEqual(12);
    })

    it("Should return err if there is nagative number in json file", () => {
        let parser = new CartParser();
        let json = JSON.parse(parser.readFile('./samples/cart.json')).items;
        let price = []; 
        let quantity = [];
        json.map( el => el.price > 0 ? price.push(true) : price.push(false));
        json.map( el => el.quantity > 0 ? quantity.push(true) : quantity.push(false));
        expect(price.includes(false) || quantity.includes(false)).toBe(false)
    })

    it("Should return err if json file hasn't got all fields from csv file", () => {
        let parser = new CartParser();
        let json = JSON.parse(parser.readFile('./samples/cart.json')).items;
        let name = [];
        let price = []; 
        let quantity = [];
        json.map( el => el.name !== undefined ? name.push(true) : name.push(false));
        json.map( el => el.price !== undefined ? price.push(true) : price.push(false));
        json.map( el => el.quantity !== undefined ? quantity.push(true) : quantity.push(false));
        expect(name.includes(false) || price.includes(false) || quantity.includes(false)).toBe(false)        
    })

    it("Should return err if there is no id in json file", () => {
        let parser = new CartParser();
        let json = JSON.parse(parser.readFile('./samples/cart.json')).items;
        let id = [];
        json.map( el => el.id !== undefined ? id.push(true) : id.push(false));
        expect(id.includes(false)).toBe(false)        
    })

    
});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.
    it("Should return err if csv file doesn't match json file", () => {

    })
});