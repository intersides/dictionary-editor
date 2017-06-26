/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {areEqual} from './utility';

@inject(WebAPI, EventAggregator)
export class ContactDetail {
  constructor(api, EventAggregator){
    this.api = api;
    this.ea = EventAggregator;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getContactDetails(params.id).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.ea.publish("ContactViewed", {testValue: 'What was viewed?'});
    });
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
  }

  save() {
    console.log("about to save");

    this.api.saveContact(this.contact).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.ea.publish("ContactSaved", {testValue: 'What was saved?'});
    });


  }

  canDeactivate() {
    if(!areEqual(this.originalContact, this.contact)){
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if(!result) {
        this.ea.publish("ContactViewed", {testValue: 'What was viewed?'});
      }

      return result;
    }

    return true;
  }
}
