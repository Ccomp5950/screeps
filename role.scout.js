module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(!Game.flags.scout1 === undefined) {
			if(creep.getRangeTo(Game.flags.scout1) > 2) {
				creep.MoveTo(Game.flags.scout1);
			}
		}

        }
    
};
