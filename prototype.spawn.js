module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	if(!bodyset) {
	    switch(numberOfParts) {
            case 1:
	    	body = [WORK, CARRY, CARRY, MOVE];
		bodyset = true;
		break;
	    case 2:
		body = [WORK,WORK,CARRY,CARRY,CARRY,MOVE];
		bodyset = true;
		break;
	    case 3:
		body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
		bodyset = true;
		break;
            case 4:
		body = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
		bodyset = true;
		break;
	    }
		


	}
	if(!bodyset) {
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }	
	}

            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false, source: null });
        };
};
