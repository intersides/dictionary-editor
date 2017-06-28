/**
 * Created by marcofalsitta on 22.03.17.
 * InterSides.net
 *
 */
/**
 * Created by marcofalsitta on 22.03.17.
 * InterSides.net
 *
 */
"use strict";

let Server = require('./common/_Server');
let logger = require('./common/utilities')().logger;
let request = require('request');
let {Client} = require('./lib/Client');
let {ClientError} = require('./lib/ClientError');
let {ColorDictionary} = require('./lib/ColorDictionary');

let fs = require('fs');

let iPhone6sGray = {
	brand:"APPLE",
	model:"A1633",
	name:"iPhone",
	version:"6s",
	productionYear:"2016",
	color:"Stonegrey",
	price:"CHF 769.00",
	description:"The moment you use iPhone 6s, you know you’ve never felt anything like it. With just a single press, 3D Touch lets you do more than ever before. Live Photos bring your memories to life in a powerfully vivid way. And that’s just the beginning. Take a deeper look at iPhone 6s, and you’ll find innovation on every level."
	//DE:"Sobald du das iPhone 6s benutzt, weisst du, dass du noch nie etwas Vergleichbares in der Hand hattest. Mit 3D Touch musst du nur einmal drücken, um mehr machen zu können als je zuvor. Und Live Photos lässt deine Erinnerungen auf beeindruckende Weise lebendig werden. Aber das ist erst der Anfang. Wenn du dir das iPhone 6s genauer ansiehst, wirst du überall Innovationen finden."
};

let alcatelPixi4 = {
	brand:"Alcatel",
	model:"8157",
	name:"Pixi",
	version:"4",
	productionYear:"2016",
	color:"Black",
	price:"CHF 456.00",
	description:"The moment you use iPhone 6s, you know you’ve never felt anything like it. With just a single press, 3D Touch lets you do more than ever before. Live Photos bring your memories to life in a powerfully vivid way. And that’s just the beginning. Take a deeper look at iPhone 6s, and you’ll find innovation on every level."
	//DE:"Sobald du das iPhone 6s benutzt, weisst du, dass du noch nie etwas Vergleichbares in der Hand hattest. Mit 3D Touch musst du nur einmal drücken, um mehr machen zu können als je zuvor. Und Live Photos lässt deine Erinnerungen auf beeindruckende Weise lebendig werden. Aber das ist erst der Anfang. Wenn du dir das iPhone 6s genauer ansiehst, wirst du überall Innovationen finden."
};

let airportExpress = {
	brand:"APPLE",
	model:"X1301",
	name:"Airport Express",
	version:"1.02",
	productionYear:"2014",
	price:"CHF 120.00",
	description:"With AirPort Express, getting your new Wi‑Fi network up and running takes less time — and less effort — than making a cup of coffee. That’s because a setup assistant is built into iOS and into AirPort Utility for OS X. And if you use a Windows PC, you can download AirPort Utility for free. As soon as you plug in your AirPort Express Base Station and connect it to your DSL or cable modem, you can follow the simple instructions on your computer or iOS device. There are no complicated steps to follow and no obscure terminology to learn. The setup assistant does all the work, so you don’t have to."
	//DE:"Mit AirPort Express kostet es weniger Zeit – und Nerven – dein neues WLAN Netzwerk startklar zu machen, als eine Tasse Kaffee zu kochen. Denn in iOS und im AirPort Dienstprogramm für OS X ist schon ein Systemassistent integriert. Und alle, die einen Windows PC nutzen, können das AirPort Dienstprogramm kostenlos herunterladen. Sobald du den AirPort Express angeschlossen und ihn mit deinem DSL- oder Kabelmodem verbunden hast, musst du nur noch den Anleitungen auf deinem Computer oder iOS Gerät folgen. Es gibt keine komplizierten Schritte oder schwierigen Fachbegriffe. Der Systemassistent nimmt dir alles ab. Wie es sich eben für einen guten Assistenten gehört."
};

let samsungJ7Black = {
	brand:"SAMSUNG",
	model:"8684",
	name:"Galaxy",
	version:"J7",
	productionYear:"2017",
	color:"Black",
	price:"CHF 569.00",
	description:"The Infinity Display sets a new standard for uninterrupted, immersive experiences. It enables an expanded screen size without necessitating a larger phone. So while the view is grander, the Galaxy S8 and S8+ feel small in your hand, making them easy to hold and use. You'll immediately notice the comfortable grip of the smooth curves in your hand, which allow you to hold on easily while you watch movies on the larger screen. And important shortcuts are a swipe away, as the edge screen is available on both the Galaxy S8 and S8+."
	//DE:"Das Infinity Display hat einen unglaublichen durchgängigen Bildschirm über die Seiten des Geräts hinaus. So entsteht eine komplett glatte Oberfläche ohne Ecken oder Unebenheiten. Die Vorderseite aus purem, makellosem, ununterbrochenem Glas geht nahtlos in das Aluminiumgehäuse über. Das Ergebnis ist ein einzigartiges, elegant geschwungenes und symmetrisches Objekt. Das Infinity Display verschiebt die Grenzen des bisher Möglichen und zeigt uns Content in einem völlig neuen Rahmen. Denn das Galaxy S8 und das Galaxy S8+ überzeugen mit einem erweiterten Sichtfeld, ohne in ihrer Gesamtgrösse zu wachsen. Der Vorteil, der sich daraus ergibt, liegt klar auf der Hand und angenehm in der Hand: Der User bekommt mehr zu sehen und geniesst dennoch den Komfort eines besonders handlichen Smartphones."
};

let samsungJ7Gold = {
	brand:"SAMSUNG",
	model:"8684",
	name:"Galaxy",
	version:"J7",
	productionYear:"2017",
	color:"Gold",
	price:"CHF 569.00",
	description:"The Infinity Display sets a new standard for uninterrupted, immersive experiences. It enables an expanded screen size without necessitating a larger phone. So while the view is grander, the Galaxy S8 and S8+ feel small in your hand, making them easy to hold and use. You'll immediately notice the comfortable grip of the smooth curves in your hand, which allow you to hold on easily while you watch movies on the larger screen. And important shortcuts are a swipe away, as the edge screen is available on both the Galaxy S8 and S8+."
	//DE:"Das Infinity Display hat einen unglaublichen durchgängigen Bildschirm über die Seiten des Geräts hinaus. So entsteht eine komplett glatte Oberfläche ohne Ecken oder Unebenheiten. Die Vorderseite aus purem, makellosem, ununterbrochenem Glas geht nahtlos in das Aluminiumgehäuse über. Das Ergebnis ist ein einzigartiges, elegant geschwungenes und symmetrisches Objekt. Das Infinity Display verschiebt die Grenzen des bisher Möglichen und zeigt uns Content in einem völlig neuen Rahmen. Denn das Galaxy S8 und das Galaxy S8+ überzeugen mit einem erweiterten Sichtfeld, ohne in ihrer Gesamtgrösse zu wachsen. Der Vorteil, der sich daraus ergibt, liegt klar auf der Hand und angenehm in der Hand: Der User bekommt mehr zu sehen und geniesst dennoch den Komfort eines besonders handlichen Smartphones."
};

let samsungS8Specs = {
	brand:"SAMSUNG",
	model:"HP010",
	name:"Galaxy",
	version:"S8",
	productionYear:"2017",
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
	color:"Mystic Silver",
	price:"CHF 27.00",
	description:"Huawei P10 sets an industry benchmark for style and craftsmanship with the first hyper diamond-cut finishing on a smartphone, which adds strength and colour."
	//DE:"Huawei P10 setzt neue Massstäbe in Stil und Verarbeitung. Die neue Diamantschliff-Oberflächenbehandlung setzt immer wieder neue Farbakzente und sorgt dabei sogar noch für mehr Stabilität."
};


class ProductListServer extends Server{

	constructor(expressServer, mysqlDb){
		super(expressServer, mysqlDb);

		this.client = new Client('ABC');
		this.client.addDictionary(new ColorDictionary("smartphones"));

		this.storedDataLocation = './storage/FNAC_coloraliases_smartphones.json';

		this.loadDataSotrage(this.storedDataLocation, (err, data)=>{
			if(err){
				console.error("Critical error, could not load dictionary data %s:",this.storedDataLocation,  err);
			}
			else{
				try{
					let jsonData = JSON.parse(data);
					this.client.getDictionary("smartphones").setFromJSON(jsonData);
				}
				catch(parseExc){
					console.error("Critical error, could not parse loaded dictionary data from %s", this.storedDataLocation);
				}
			}
		});


		this.addRoutes();
	}

	loadDataSotrage(_pathToData, _callback){
		fs.readFile(_pathToData, {encoding: 'utf8'}, _callback);
	}


	addRoutes(){

		this.rest.post('/products', (req, res)=>{
			res.status(200).json({products:this.getProducts()});
		});

		this.rest.get('/colorAliases', (req, res)=>{
			res.status(200).json({colorAliases:this.getColorAliases()});
		});

		this.rest.post('/addDomainRange', (req, res)=>{
			let entry = req.body;
			logger.log("entry", entry);
			let entryResult = this.client.addEntryToDictionary(entry.value, entry['list']);

			let currentEntries = null;
			if( (entryResult instanceof ClientError) === false){
				logger.info(entryResult);
				currentEntries = this.client.getDictionary(entry['list']).getEntries();
				//save
				fs.writeFile(this.storedDataLocation, JSON.stringify(currentEntries, null, '\t'), {encoding:'utf8'}, (err)=>{
					if(err){
						logger.error("Could not save data ", err);

					}
					else{
						logger.log("data stored!");
					}
				});
			}
			else{
				logger.error(entryResult);
			}
			res.status(200).json({colorAliases:currentEntries, result:entryResult});

		});

		this.rest.post('/removeDomainRange', (req, res)=>{
			let entry = req.body;
			logger.log("entry", entry);


			let currentEntries = null;
			let deleteResult = this.client.removeEntryFromDictionary(entry.value, entry['list']);

			if( (deleteResult instanceof ClientError) === false){
				logger.info(deleteResult);
				currentEntries = this.client.getDictionary(entry['list']).getEntries();
				if(deleteResult === true){
					//save
					fs.writeFile(this.storedDataLocation, JSON.stringify(currentEntries, null, '\t'), {encoding:'utf8'}, (err)=>{
						if(err){
							logger.error("Could not save data ", err);

						}
						else{
							logger.log("data stored!");
						}
					});
				}

			}
			else{
				logger.error(deleteResult);
			}
			res.status(200).json({colorAliases:currentEntries, result:deleteResult});


		});

		this.rest.post('/editDomainRange', (req, res)=>{
			let requestData = req.body;
			logger.log("entry", requestData);

			let propertyType = requestData['type'];

			let updateResult = null;
			if(propertyType === "range"){
				updateResult = this.client.updateRangeInDictionary(requestData['value']['old'], requestData['value']['new'], requestData['list']);
			}
			else if(propertyType === "domain"){
				updateResult = this.client.updateDomainInDictionary(requestData['value']['old'], requestData['value']['new'], requestData['list']);
			}
			else{
				console.error("unexpected type... ", propertyType);
			}

			let currentEntries = null;

			//TODO:ensure that we only receive ClientError or object. Not a DictionaryError
			if( (updateResult instanceof ClientError ) === false ){
				logger.info(updateResult);
				currentEntries = this.client.getDictionary(requestData['list']).getEntries();
				//save
				fs.writeFile(this.storedDataLocation, JSON.stringify(currentEntries, null, '\t'), {encoding:'utf8'}, (err)=>{
					if(err){
						logger.error("Could not save data ", err);
					}
					else{
						logger.log("data stored!");
					}
				});

			}
			else{
				logger.error(updateResult);
			}
			res.status(200).json({colorAliases:currentEntries, result:updateResult});

		});

	}

	getProducts(){
		let routersSet = [airportExpress];
		let smartPhonesSet = [iPhone6sGray, alcatelPixi4, samsungS8Specs, samsungJ7Black, samsungJ7Gold, huaweiPSpecs];

		return {
			sPhones:smartPhonesSet,
			routers:routersSet
		};
	}

	getColorAliases(){
		return this.client.getDictionary("smartphones").getEntries();
	}


}

module.exports = ProductListServer;