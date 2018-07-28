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

    it('Should return [] of errors if file.csv if a valid file', () => {
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

    it('Should return err if there is negative number', () => {
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

    it('Should return all possible err on wrong csv file ', () => {
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
});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.

});