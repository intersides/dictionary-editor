import jQuery from "jquery";

export class App {

  configureRouter(config, router){

    config.title = 'Contacts';

    //registering routes
    config.map([
      {route:'', moduleId:'no-selection', title:'Select'},
      {route:'contacts/:id', moduleId:'contact-detail', name:'contacts'}
    ]);

    this.router = router;

  }

  constructor(){

    console.log("about to request...");

    jQuery.ajax({
      url:"product/991",
      success:(response)=>{
        console.warn(response);
      }
    });

  }

}
