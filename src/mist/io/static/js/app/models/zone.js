define('app/models/zone', ['ember'],
    /**
     * Zone model
     *
     * @returns Class
     */
    function() {
        return Ember.Object.extend({
            id: null,
            name: null,
        });
    }
);
