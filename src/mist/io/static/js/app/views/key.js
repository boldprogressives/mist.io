define('app/views/key', [
    'app/views/mistscreen',
    'text!app/templates/key.html',
    'ember'
    ],
    /**
     *
     * Key page
     *
     * @returns Class
     */
    function(MistScreen, key_html) {
        return MistScreen.extend({
            
            disabledAssociateClass: function() {
                var count = 0
                Mist.backendsController.content.forEach(function(item){
                    count = count + item.machines.content.length;
                });
                if (count == 0) {
                    return 'ui-disabled';
                } else {
                    return '';
                }
            }.property('key'),

            keyMachines: function() {
        	var key = this.get('controller').get('model');
        	
                machineNames = [];
                if (key) {
                    key.machines.forEach(function(item){
                        Mist.backendsController.content.forEach(function(backend){
                            backend.machines.content.forEach(function(machine){
                                if (machine.id == item[1]) {
                                    machineNames.push(machine);
                                }
                            });
                        });
                    });
                }
                console.log(machineNames);
                return machineNames;
            }.property('key.machines'),

            associateKey: function() {
        	var key = this.get('controller').get('model');
        	
                $.mobile.changePage('#key-associate-dialog');
                //check boxes for machines associated with this key
                $('li').find("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
                key.machines.forEach(function(item){
                    info(item[1]);
                    $('li.'+item[1]).find("input[type='checkbox']").attr("checked",true).checkboxradio("refresh");
                    Mist.backendsController.content.forEach(function(backend){
                        backend.machines.content.forEach(function(machine){
                            if (machine.id == item[1]) {
                                machine.set("selected",true);
                            }
                        });
                    });
                });
            },

            deleteKey: function() {
                var key = this.get('controller').get('model');
                if (key.machines) {
                    machineNames = [];
                    key.machines.forEach(function(item){
                        Mist.backendsController.content.forEach(function(backend){
                            if (backend.id == item[0]) {
                                backend.machines.content.forEach(function(machine){
                                    if (machine.id == item[1]) {
                                        machineNames.push(machine.name);
                                    }
                                });
                            }
                        });
                    });
                }

                Mist.confirmationController.set('title', 'Delete Key: ' + key.name);
                if (key.machines.length > 0) {
                Mist.confirmationController.set('text', 'Your key is associated with ' + machineNames.toString() +'. Are you sure you want to delete ' +  key.name + '? You will not be able use console and monitoring on these VMs.');                    
                } else {
                    Mist.confirmationController.set('text', 'Are you sure you want to delete ' +
                                                key.name + '?');
                }
                Mist.confirmationController.set('callback', function() {
                    key.deleteKey();
                    key.machines.forEach(function(item){
                        Mist.backendsController.content.forEach(function(backend){
                            if (backend.id == item[0]) {
                                backend.machines.content.forEach(function(machine){
                                    if (machine.id == item[1]) {
                                        machine.set("hasKey", false);
                                    }
                                });
                            }
                        });
                    });
                    $.mobile.changePage('#keys');
                });
                Mist.confirmationController.set('fromDialog', true);

                Mist.confirmationController.show();
            },

            displayPrivate: function(){
                var key = this.get('controller').get('model');
                Mist.keysController.getPrivKey(key);
                $("#key-private-dialog").popup("open", {transition: 'pop'});
            },

            template: Ember.Handlebars.compile(key_html),
        });
    }
);
