module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.buildBody =
	function(bodyO) {
		result = [];
		for(var part in bodyO) {
			for(let i = 0; i < bodyO[part]; i++) {
				if((part != "MOVE" && part != "move") || (i+1 != bodyO[part])) {
					result.push(part);
				}
			}
		}
	result.push("move");
	return result;
	};
		

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
	if(roleName == "towerdrainer") {
		body = this.buildBody({tough:5,move:9,heal:4});
		bodyset = true;
	}
	if(roleName == "scout") {
		body = this.buildBody({move:3,carry:1});
		bodyset = true;
	}
	else if(roleName == "attacker") {
		body = this.buildBody({attack:5,move:6});
		bodyset = true;
	}
	else if (roleName == "defender") {
		body = this.buildBody({tough:6,attack:3,move:5,heal:1});
		bodyset = true;
	}
	else if (roleName == "miner") {
		body = this.buildBody({work:5,carry:1,move:2});
		bodyset = true;
	}
        else if (roleName == "remoteharvester") {
		body = this.buildBody({work:2,carry:9,move:11});
                bodyset = true;
        }
	else if (roleName == "harvester" && energy > 850) {
		body = this.buildBody({work:1,carry:7,move:8});
		bodyset = true;
	}
	else if (roleName == "fetcher") {
		for(let i = 0; i < (numberOfParts * 2); i++) {
			body.push(CARRY);
			body.push(MOVE);
		}
		bodyset = true;
        }



	if(!bodyset) {
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
		body.push(CARRY);
		body.push(MOVE);
            }
	}
            // create creep with the created body and the given role
            return this.createCreep(body, name, { role: roleName, working: false, source: null });
        };
};
