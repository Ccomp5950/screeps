module.exports = function() {
    // create a new function for StructureSpawn
   	Source.prototype.isFree =
        function(creep) {
                var opens = 0;
                var spawn = this;
		
		if(creep != undefined && creep.pos.getRangeTo(spawn) <= 1) {
			return true;
		}
                var offsets =   [[1,1],
                                 [1,0],
                                 [0,1],
                                 [-1,1],
                                 [1,-1],
                                 [-1,0],
                                 [-1,-1],
                                 [0,-1]
                                ];
                for(let offset of offsets) {
                        let xa = spawn.pos.x + offset[0];
                        let ya = spawn.pos.y + offset[1];
                        let checkpos = new RoomPosition(xa, ya, spawn.room.name);
                        let terrain = checkpos.lookFor(LOOK_CREEPS);
                        if(terrain.length) {
				continue;
                        }
			terrain = checkpos.lookFor(LOOK_TERRAIN);
			if(terrain.length && terrain != "plain" && terrain != "swamp") {
                                continue;
                        }

			
                        return true;
                }
        return false;
        }
};
