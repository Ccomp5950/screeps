module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(!Game.flags.scout1 === undefined) {
			var range = creep.pos.getRangeTo(Game.flags.scout1);
			console.log("Found the flag at range: " + range);
			if(range > 2) {
				console.log("And that is further then 2");
				creep.moveTo(Game.flags.scout1);
			}
		}

        }
    
};
