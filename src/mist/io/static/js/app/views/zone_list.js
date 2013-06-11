define('app/views/zone_list', [
     'app/views/mistscreen',
    'text!app/templates/zone_list.html',
    'ember'
    ],
    /**
     *
     * Key list page
     *
     * @returns Class
     */
    function(MistScreen, zone_list_html) {
        return MistScreen.extend({
            
            template: Ember.Handlebars.compile(zone_list_html),

            deleteZone: function(){
                var zones = this.getSelectedZones();
                var plural = false;

                if(zones.length == 0){
                    return;
                } else if(zones.length > 1){
                    plural = true;
                }

                Mist.confirmationController.set("title", 'Delete Zone' + (plural ? 's' : ''));

                var names = '';

                zones.forEach(function(zone){
                    names = names + ' ' + zone.name;
                });

                Mist.confirmationController.set("text", 'Are you sure you want to delete' +
                        names +'?');

                Mist.confirmationController.set("callback", function(){
                    zones.forEach(function(zone){
                       zone.deleteKey();
                       $('#zones .zones-footer').fadeOut(200);
                    });
                });

                Mist.confirmationController.set("fromDialog", true);
                Mist.confirmationController.show();
            },

            getSelectedZones: function(){
                var zones = new Array();

                Mist.backendsController.forEach(function(backend){
		    backend.zones.forEach(function(zone){
                        if(zone.selected){
                            zones.push(zone);
                        }
		    });
                });

                return zones;
            },
            
            addZone: function(){
               $("#dialog-add-zone").popup("open", {transition: 'pop'});
            },
            
            selectZones: function(event) {
                var selection = $(event.target).attr('title');
    
                if(selection == 'none'){
                    Mist.backendsController.forEach(function(backend){
			backend.zones.forEach(function(zone){
                            log('deselecting zone: ' + zone.name);
                            zone.set('selected', false);
			});
                    });
                } else if(selection == 'all'){
                    Mist.backendsController.forEach(function(backend){
			backend.zones.forEach(function(zone){
                            log('selecting zone: ' + zone.name);
                            zone.set('selected', true);
			});
		    });
                }  
                Ember.run.next(function(){
                    $("input[type='checkbox']").checkboxradio("refresh");
                });
                $("#select-zones-listmenu li a").off('click', this.selectZones);
                $('#select-zones-popup').popup('close');
                return false;                           
            },
            
            openKeySelectPopup: function() {
                $('#select-keys-listmenu').listview('refresh');
                $('#select-keys-popup').popup('option', 'positionTo', '.select-keys').popup('open', {transition: 'pop'});
                $("#select-keys-listmenu li a").on('click', this.selectKeys);
            },
            
            disabledDefaultClass : function() {
                var zones = new Array();
    
                Mist.backendsController.forEach(function(backend){
		    backend.zones.forEach(function(zone){
			if (zone.selected == true) {
                            zones.push(zone);
			}
		    });
                });
                if (zones.length != 1) {
                    // only enable action if a single zone is selected
                    return 'ui-disabled';
                } else {
                    return '';
                }
            }.property('Mist.backendsController.selectedZoneCount')                     
        });
    }
);
