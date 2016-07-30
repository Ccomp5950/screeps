module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
	    var nameNumber = 1;
	    var name=roleName + nameNumber.toString();
	    while(Game.creeps[name] != undefined) {
		nameNumber++;
		name=roleName + nameNumber.toString();
		if(nameNumber > 20) {
			break;
		}
	    }
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	if(roleName == "scout") {
		body = [MOVE, MOVE, MOVE, MOVE];
		bodyset = true;
	}
	else if(roleName == "attacker") {
		body = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
		bodyset = true;
	}
	else if (roleName == "defender") {
		body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE];
		bodyset = true;
	}


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
            return this.createCreep(body, name, { role: roleName, working: false, source: null });
        };
    RoomObject.Source.prototype.hasSpace =
        function() {
		var opens = 0;
		var spawn = this;
		var offsets = 	[[1,1],
				 [1,0],
				 [0,1],
				 [-1,1],
				 [1,-1],
				 [-1,0],
				 [-1,-1],
				 [0,-1]
				];
		for(let offset of offsets) {
			let x = spawn.pos + offset[0];
			let y = spawn.pos + offset[1];
			let checkpos = new RoomPosition(x, y, spawn.room);
			let terrain = checkpos.lookFor(OBSTACLE_OBJECT_TYPES);
			if(terrain.length) {
				continue;
			}
			opens++;
		}
	return opens;				
	};
};
