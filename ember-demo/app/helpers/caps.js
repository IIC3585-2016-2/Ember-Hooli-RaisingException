import Ember from 'ember';

export function caps(params) {
    return params.map( s => s.toUpperCase());
}

export default Ember.Helper.helper(caps);
