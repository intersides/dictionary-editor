/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */
"use strict";

//let logger = require('../server/common/utilities')().logger;
let assert = require('chai').assert;
let expect = require('chai').expect;
let should = require('chai').should();

let { ColorDictionary } = require('../server/lib/ColorDictionary');
let { ProductList } = require('../server/lib/ProductList');
let { ProductType } = require("../server/enums/ProductType");
let { SmartPhone, Router } = require("../server/lib/products");
let { ProductDisplay } = require("../server/lib/ProductDisplay");



//mocked data
let originalDataSet = {
    "A1633":{
        name:"iPhone 6s",
        color:"Stonegrey",
        price:"769.00",
        currency:"CHF"
    },
    "G950U":{
        name:"Samsung Galaxy S8",
        color:"Midnight Blue",
        price:"569.00",
        currency:"CHF"
    },
    "HP010":{
        name:"Huawei P 10",
        color:"Mystic Silver",
        price:"27.00",
        currency:"CHF"
    }

};

let desiredDataSet = {
    "A1633":{
        name:"iPhone 6s",
        color:"Dark Grey",
        price:"769.00",
        currency:"CHF"
    },
    "G950U":{
        name:"Samsung Galaxy S8",
        color:"Black",
        price:"569.00",
        currency:"CHF"
    },
    "HP010":{
        name:"Huawei P 10",
        color:"Silver",
        price:"27.00",
        currency:"CHF"
    }

};


describe("ProductDisplay class", ()=>{
    it("should get all products in available sets", ()=>{

        let productDisplay = new ProductDisplay();
        let noProducts = productDisplay.getAllProducts();
        expect(noProducts).to.be.empty;
        expect(noProducts).to.have.property("length",0);
    });



});


describe("ProductList class", ()=>{

    describe("initialisation", ()=>{

        it("should init with no arguments", ()=>{
            let sPhonesProducts = new ProductList(ProductType.SMARTPHONES);
            expect(sPhonesProducts).to.have.property("type", ProductType.SMARTPHONES);
            expect(sPhonesProducts).to.have.property("list");
            expect(sPhonesProducts["list"]).to.be.empty;
        });

    });

    describe("adding items", ()=>{

        it("should add an item to the set if correspond to specified product type", ()=>{
            let sPhonesProducts = new ProductList(ProductType.SMARTPHONES);
            let addedProduct = sPhonesProducts.addProduct(new SmartPhone());
            expect(addedProduct).to.not.be.undefined;
            expect(addedProduct).to.not.be.null;
            expect(sPhonesProducts["list"]).to.not.be.empty;
        });

        it("should NOT add an item not correspond to product type", ()=>{
            let sPhonesProducts = new ProductList("WHATEVER");
            let addedProduct = sPhonesProducts.addProduct(new SmartPhone());
            expect(addedProduct).to.be.null;
            expect(sPhonesProducts["list"]).to.be.empty;
        });

    });


    describe("set client properties", ()=>{

        let iPhone6sGray = {
            brand:"APPLE",
            model:"A1633",
            name:"iPhone",
            version:"6s",
            productionYear:"2016",
            IMEI:"352066060926230",
            serialNumber:"C02CG123DC79",
            color:"Stonegrey",
            price:"CHF 769.00",
            description:"The moment you use iPhone 6s, you know you’ve never felt anything like it. With just a single press, 3D Touch lets you do more than ever before. Live Photos bring your memories to life in a powerfully vivid way. And that’s just the beginning. Take a deeper look at iPhone 6s, and you’ll find innovation on every level."
            //DE:"Sobald du das iPhone 6s benutzt, weisst du, dass du noch nie etwas Vergleichbares in der Hand hattest. Mit 3D Touch musst du nur einmal drücken, um mehr machen zu können als je zuvor. Und Live Photos lässt deine Erinnerungen auf beeindruckende Weise lebendig werden. Aber das ist erst der Anfang. Wenn du dir das iPhone 6s genauer ansiehst, wirst du überall Innovationen finden."
        };

        let airportExpress = {
            brand:"APPLE",
            model:"X1301",
            name:"Airport Express",
            version:"1.02",
            productionYear:"2014",
            serialNumber:"AXDSFRG4543FF",
            price:"CHF 120.00",
            description:"With AirPort Express, getting your new Wi‑Fi network up and running takes less time — and less effort — than making a cup of coffee. That’s because a setup assistant is built into iOS and into AirPort Utility for OS X. And if you use a Windows PC, you can download AirPort Utility for free. As soon as you plug in your AirPort Express Base Station and connect it to your DSL or cable modem, you can follow the simple instructions on your computer or iOS device. There are no complicated steps to follow and no obscure terminology to learn. The setup assistant does all the work, so you don’t have to."
            //DE:"Mit AirPort Express kostet es weniger Zeit – und Nerven – dein neues WLAN Netzwerk startklar zu machen, als eine Tasse Kaffee zu kochen. Denn in iOS und im AirPort Dienstprogramm für OS X ist schon ein Systemassistent integriert. Und alle, die einen Windows PC nutzen, können das AirPort Dienstprogramm kostenlos herunterladen. Sobald du den AirPort Express angeschlossen und ihn mit deinem DSL- oder Kabelmodem verbunden hast, musst du nur noch den Anleitungen auf deinem Computer oder iOS Gerät folgen. Es gibt keine komplizierten Schritte oder schwierigen Fachbegriffe. Der Systemassistent nimmt dir alles ab. Wie es sich eben für einen guten Assistenten gehört."
        };

        let samsungS8Specs = {
            brand:"SAMSUNG",
            model:"HP010",
            name:"Galaxy",
            version:"S8",
            productionYear:"2017",
            IMEI:"304930940950495",
            serialNumber:"SSNG3443SDSD332",
            color:"Midnight Black",
            price:"CHF 569.00",
            description:"The Infinity Display sets a new standard for uninterrupted, immersive experiences. It enables an expanded screen size without necessitating a larger phone. So while the view is grander, the Galaxy S8 and S8+ feel small in your hand, making them easy to hold and use. You'll immediately notice the comfortable grip of the smooth curves in your hand, which allow you to hold on easily while you watch movies on the larger screen. And important shortcuts are a swipe away, as the edge screen is available on both the Galaxy S8 and S8+."
            //DE:"Das Infinity Display hat einen unglaublichen durchgängigen Bildschirm über die Seiten des Geräts hinaus. So entsteht eine komplett glatte Oberfläche ohne Ecken oder Unebenheiten. Die Vorderseite aus purem, makellosem, ununterbrochenem Glas geht nahtlos in das Aluminiumgehäuse über. Das Ergebnis ist ein einzigartiges, elegant geschwungenes und symmetrisches Objekt. Das Infinity Display verschiebt die Grenzen des bisher Möglichen und zeigt uns Content in einem völlig neuen Rahmen. Denn das Galaxy S8 und das Galaxy S8+ überzeugen mit einem erweiterten Sichtfeld, ohne in ihrer Gesamtgrösse zu wachsen. Der Vorteil, der sich daraus ergibt, liegt klar auf der Hand und angenehm in der Hand: Der User bekommt mehr zu sehen und geniesst dennoch den Komfort eines besonders handlichen Smartphones."
        };

        let huaweiPSpecs = {
            brand:"HUAWEI",
            model:"HP010",
            name:"Huawei P",
            version:"10",
            productionYear:"2014",
            IMEI:"2320943434340",
            serialNumber:"HWD3443FRSS",
            color:"Mystic Silver",
            price:"CHF 27.00",
            description:"Huawei P10 sets an industry benchmark for style and craftsmanship with the first hyper diamond-cut finishing on a smartphone, which adds strength and colour."
            //DE:"Huawei P10 setzt neue Massstäbe in Stil und Verarbeitung. Die neue Diamantschliff-Oberflächenbehandlung setzt immer wieder neue Farbakzente und sorgt dabei sogar noch für mehr Stabilität."
        };


        it("should create a product list type smartphone and set a color filter ", ()=>{

            let iPhone6Grey = new SmartPhone(iPhone6sGray);
            let huaweiP10Silver = new SmartPhone(huaweiPSpecs);

            let sPhonesProducts = new ProductList(ProductType.SMARTPHONES);
            sPhonesProducts.addProduct(iPhone6Grey);
            sPhonesProducts.addProduct(huaweiP10Silver);

            let colorDictionary = new ColorDictionary();
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");

            let productDisplay = new ProductDisplay();
            productDisplay.addSet(sPhonesProducts);
            productDisplay.addFilter("color", colorDictionary);


            let products = productDisplay.getProductsFromSet({
                selector:{brand:"APPLE", model:"A1633"},
                setType:ProductType.SMARTPHONES,
                transformed:true
            });
            expect(products).to.have.property("length", 1);
            let iPhone = products[0];
            expect(iPhone).to.not.be.undefined;
            expect(iPhone).to.not.be.null;
            expect(iPhone.clientProperties.color).to.not.be.undefined;
            expect(iPhone.clientProperties).to.have.property("color", "Dark Grey");
            expect(iPhone).to.have.property("color", "Stonegrey"); //original property
            expect(iPhone6sGray).to.have.property("color", "Stonegrey");
        });


        it("should get all available product using default parameters", ()=>{

            let phonesProducts = new ProductList(ProductType.SMARTPHONES);
            phonesProducts.addProduct(new SmartPhone(iPhone6sGray));
            phonesProducts.addProduct(new SmartPhone(samsungS8Specs));
            phonesProducts.addProduct(new SmartPhone(huaweiPSpecs));

            let routerProducts = new ProductList(ProductType.ROUTERS);
            routerProducts.addProduct(new Router(airportExpress));


            let productDisplay = new ProductDisplay();
                productDisplay.addSet(phonesProducts);
                productDisplay.addSet(routerProducts);

            let allProducts = productDisplay.getProductsFromSet();
            expect(allProducts).to.have.length(4);

            let allSmartPhones = productDisplay.getProductsFromSet({setType:ProductType.SMARTPHONES});
            expect(allSmartPhones).to.have.length(3);


            let allAppleProducts = productDisplay.getProductsFromSet({
                selector:{brand:"APPLE"}
            });
            expect(allAppleProducts).to.have.length(2);

            let allApplePhones = productDisplay.getProductsFromSet({
                selector:{brand:"APPLE"},
                setType:ProductType.SMARTPHONES
            });
            expect(allApplePhones).to.have.length(1);

        });

        it("should create a product list type smartphone and set a client properties on color and description", ()=>{

            let colorDictionary = new ColorDictionary();
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let sPhonesProducts = new ProductList(ProductType.SMARTPHONES);
            sPhonesProducts.addProduct(new SmartPhone(iPhone6sGray));
            sPhonesProducts.addProduct(new SmartPhone(samsungS8Specs));
            sPhonesProducts.addProduct(new SmartPhone(huaweiPSpecs));

            let productDisplay = new ProductDisplay();
            productDisplay.addSet(sPhonesProducts);
            productDisplay.addFilter("color", colorDictionary);

            let products = productDisplay.getProductsFromSet({
                selector:null,
                setType:ProductType.SMARTPHONES,
                transformed:true
            });
            let iPhone = products[0];
            let samsung = products[1];
            let huawei = products[2];
            expect(iPhone).to.not.be.undefined;
            expect(iPhone).to.not.be.null;

            expect(iPhone.clientProperties).to.have.property("color", "Dark Grey");
            expect(samsung.clientProperties).to.have.property("color", "Black");
            expect(huawei.clientProperties).to.have.property("color", "Silver");

        });

    });




    describe("log final structure", ()=>{
        it("should log", ()=>{
            console.log("---------------smartphone products----------------");
        });
    });


});