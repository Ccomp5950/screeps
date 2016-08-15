module.exports = {
	getNeeded: function(role) {
		if(this[role] != undefined) {
			return this[role];
		} else {
			return Memory.roles[role].minimum;
		}
	},

        claimer =
        function() {
                var needed = 0;
                flags = _.filter(Game.flags, function(o) { if(o.name.substr(0,11) == "claimerSpot") return true})
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
