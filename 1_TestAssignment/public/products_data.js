//Author: Meghan Nagai
//Followed Assignmnet 1 instructions and looked at Smart Phone Products
products_array = [
    //Product 1
    {
        "product_name": "Curved Bar Necklace",
        "brand": "Jared",
        "price": "2499.99",
        "image": "https://www.jared.com/productimages/processed/V-211326208_0_565.jpg?pristine=true"
    },

    //Product 2
    {
        "product_name": "Le Vian Diamond Necklace",
        "brand": "Kay",
        "price": "2297.50",
        "image": "https://www.kayoutlet.com/productimages/processed/V-476924701_0_565.jpg?pristine=true"
    },

    //Product 3
    {
        "product_name": "Pear Halo Pendant",
        "brand": "Blue Nile",
        "price": "2390.00",
        "image": "https://bnsec.bluenile.com/bluenile/is/image/bluenile/-pear-halo-pendant-in-14k-white-gold-half-ct-tw-/79688_main?$phab_detailmain$"
    },
    //Product 4
    {
        "product_name": "Prong-Set Diamond Solitaire Bypass Pendant",
        "brand": "Angara",
        "price": "2132.00",
        "image": "https://pics.angara.com/catalog/product/s/p/sp0892d-wg-gvs2-5.1.jpg"
    },
    //Product 5
    {
        "product_name": "Diamond and Tanzanite Flower Pendant",
        "brand": "Tiffany & Co.",
        "price": "3000.00",
        "image": "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-paper-flowersdiamond-and-tanzanite-flower-pendant-61625690_984447_ED.jpg"
    }
];

//if inputs are not undefined export products array data
if (typeof module != 'undefined') {
    module.exports.products_array = products_array;
}