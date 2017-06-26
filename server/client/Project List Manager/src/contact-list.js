/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */

import {EventAggregator} from 'aurelia-event-aggregator';

import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';

@inject(WebAPI, EventAggregator)
export class ContactList {
  constructor(api, EventAggregator) {
    this.api = api;
    this.contacts = [];

    EventAggregator.subscribe("ContactViewed", (msg)=>{
      console.warn(msg);
    });

    EventAggregator.subscribe("ContactSaved", (msg)=>{
      console.warn(msg);
    });

  }

  created() {
    this.api.getContactList().then(contacts => this.contacts = contacts);
  }

  select(contact) {
    this.selectedId = contact.id;
    return true;
  }
}
