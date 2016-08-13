module.exports = function() {
    // create a new function for StructureSpawn
	Flag.prototype.hasFetcher =
	function() {
		let flag = this;
		if(flag.memory.fetcher == null) {
			return false;
		} else {
			var creep = null;
			creep = Game.getObjectById(flag.memory.Fetcher);
			if(creep == null) {
				return false;
			}
		}
	return true;
	}
   	Flag.prototype.hasMiner =
        function() {
                let flag = this;
                if(flag.memory.miner == null) {
                        return false;
                } else {
                        var creep = null;
                        creep = Game.getObjectById(flag.memory.Miner);
                        if(creep == null) {
                                return false;
                        }
                }
	return true;
        };
        Flag.prototype.hasClaimer =
        function() {
                let flag = this;
                if(flag.memory.Claimer == null) {
                        return false;
                } else {
                        var creep = null;
                        creep = Game.getObjectById(flag.memory.Claimer);
                        if(creep == null) {
                                return false;
                        }
                }
        return true;
        };
	Flag.prototype.needsClaimer =
	function() {
			let flag = this;
                        var ticks = 0;
                        if(flag.room.controller.reservation != undefined) {
                                ticks = flag.room.controller.reservation.ticksToEnd;
                        }
                        if(flag.memory.active == true && ticks < 2000 && flag.hasClaimer() == false) {
                                return true;
                        }
	return false;

	};

	Flag.prototype.setRoom =
	function(roomString, force) {
		let flag = this;
		if(flag.memory.spawn == undefined) {
			if(Game.rooms[roomString] == undefined) {
				console.log("Error, assigning " + roomString + " to " + flag.name + "Room undefined");
			}

			flag.memory.spawn = roomString
		}
	}



        
};
