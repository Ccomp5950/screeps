	global.checkRoles =
	function(role) {
		let count = 0;
		for(creepM in Game.creeps) {
			let creep = Game.creeps[creepM];
			if(creep.memory.role == role) {
				count++;
			}
		
		}
		return count;
	};

	global.displayRoles =
	function() {
		var rolecount = new Object();
		for(creepM in Game.creeps) {
			let creep = Game.creeps[creepM];
			if(rolecount[creep.memory.role] == null) {
				rolecount[creep.memory.role] = 0;
			}
			rolecount[creep.memory.role]++;
		}
		for(roleM in rolecount) {
			console.log("You have " + rolecount[roleM] + " " + roleM +"'s creeps");
		}
	return null;
	};

	global.distCheck =
	function() {
	if(Game.flags.check1 != undefined && Game.flags.check2 != undefined) {
		let x1 =  Game.flags.check1.pos.x;
		let x2 =  Game.flags.check2.pos.x;
		let y1 =  Game.flags.check1.pos.y;
		let y2 =  Game.flags.check2.pos.y;
		let range = Game.flags.check1.pos.getRangeTo(Game.flags.check2.pos);
		console.log("Range Check ("+ x1 + "/" +y1 +") / ("+ x2 +"/" + y2 +"): "+ range);
	}
}	
	global.calculateDistance =
	function(xa,ya,xb,yb) {
		let xdiff = xb - xa;
		let ydiff = yb - ya;
		let xsqr = Math.pow(xdiff, 2);
		let ysqr = Math.pow(ydiff, 2);
		return Math.sqrt(ysqr + xsqr);
	}

	global.getClaimersNeeded =
	function() {
		let needed = 0;
		flags = _.filter(Game.flags, function(o) { if(o.name.substr(0,11) == "claimerSpot") return true})
		for(flagM in flags) {
			let flag = flags[flagM];
			if(flag.active && (flag.room.controller.reservation == undefined || flag.room.controller.reservation.ticksToEnd < 4000) {
				needed++;
			}
		}
		return needed;
	}


	
