module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
                if(creep.spawning) {
                        return;
                }
		if(Game.flags["scout1"] != undefined) {
			var range = creep.pos.getRangeTo(Game.flags.scout1);
			if(range > 2) {
				creep.moveTo(Game.flags.scout1);
			}
		}

        }
    
};
