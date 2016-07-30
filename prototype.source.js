module.exports = function() {
    // create a new function for StructureSpawn
   	Source.prototype.isFree =
        function(creep) {
                var opens = 0;
                var spawn = this;
		
		if(creep != undefined && creep.pos.getRangeTo(spawn) <= 1) {
			console.log("in shortcut");
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
                        let checkpos = new RoomPosition(xa, ya, spawn.room);
                        let terrain = checkpos.lookFor(OBSTACLE_OBJECT_TYPES);
                        if(terrain.length) {
				console.log("Terain type at (" + xa + ", " + ya +") "+ terrain);
				continue;
                        }
			console.log("TRUE Terain type at (" + xa + ", " + ya +") "+ terrain);
                        return true;
                }
        return false;
        }
};
