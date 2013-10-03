define('app/controllers/zones', [
    'app/models/zone',
    'ember',
    'jquery'
    ],
    /**
     * Zones controller
     *
     *
     * @returns Class
     */
    function(Zone) {
        return Ember.ArrayController.extend({
            backend: null,

            init: function() {
                this._super();

                var that = this;
                $.getJSON('/backends/' + this.backend.id + '/zones', function(data) {
                    var content = new Array();
                    data.forEach(function(item){
                        content.push(Zone.create(item));
                    });
                    that.set('content', content);
                }).error(function() {
                    Mist.notificationController.notify("Error loading zones");
                });
            }
        });
    }
);
