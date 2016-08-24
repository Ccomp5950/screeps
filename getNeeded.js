module.exports = {
	getNeeded: function(role,room) {
		if(this[role] != undefined) {
			return this[role](room);
		} else if(Memory.rooms[room].role[role] != undefined) {
				return Memory.rooms[room].role[role].minimum;
		} 
		return 0;
	},

        claimer : 
        function(room) {
                var needed = 0;
                flags = _.filter(Game.flags, function(o) { if(o.name.substr(0,11) == "claimerSpot" && o.memory.spawn == room) return true})
                for(flagM in flags) {
                        let flag = flags[flagM];
                        var ticks = 0;
                        if(flag.room != undefined && flag.room.controller.reservation != undefined) {
                                ticks = flag.room.controller.reservation.ticksToEnd;
                        }
                        if(flag.memory.active == true && ticks < 2000) {
                                needed++;
                        }
                }
                return needed;
        }
}
