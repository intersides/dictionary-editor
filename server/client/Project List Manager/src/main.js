/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */
import environment from './environment';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');
    //.feature('app');
    //.feature('contact-list')
    //.feature('contact-detail')
    //.feature('no-selection');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
