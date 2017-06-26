/**
 * Created by marcofalsitta on 25.06.17.
 * InterSides.net
 *
 */

export function configure(aurelia) {
    aurelia.use.basicConfiguration();
    aurelia.start().then(() => aurelia.setRoot());
}