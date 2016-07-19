module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	if(roleName == "repairer") {
		switch(numberOfParts) {
		
		case 1:
			body = [WORK,CARRY,MOVE,MOVE];
			break;
		case 2:
			body = [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
			break;
		case 3:
			body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
			break;		

		}
		bodyset = true;
	}
	
	if(!bodyset) {
	    switch(numberOfParts) {
            case 1:
	    	body = [WORK, CARRY, CARRY, MOVE];
		break;
	    case 2:
		body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE];
		break;
	    case 3:
		body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
		break;
	    }
	}

            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false, source: null });
        };
};
