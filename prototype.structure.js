module.exports = function() {
    // create a new function for StructureSpawn
   	Structure.prototype.isBeingHandled =
        function(creep) {
		let s = this;
		let role = creep.memory.currentRole;
		if(Memory.structure == undefined) {
			Memory.structure = {};
		}
		if(Memory.structure[s.id] == undefined) {
			Memory.structure[s.id] = {};
		}
		let Smem = Memory.structure[s.id];
		if(Smem[role] == undefined) {
			
			Smem[role] = {creep: null, lastHandled: -1}; 
		}
		Smem = Smem[role];
		if(Smem.creep == null) {
			return false;
		}
		if(Smem.lastHandled < Game.time - 3) {
			Smem.creep = null;
			return false;
		}
		if(Smem.creep == creep.id) {
			return false;
		}
		return true;
        };
	Structure.prototype.iGotIt =
	function(creep) {
		let s = this;
		let role = creep.memory.currentRole;
		if(s.isBeingHandled(creep) == false) {
			let Smem = Memory.structure[s.id][role];
			Smem.creep = creep.id;
			Smem.lastHandled = Game.time;
		}
	}
};
