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
		if(Memory.structure[s.id][role] == undefined) {
			
			Memory.structure[s.id][role] = {creep: null, lastHandled: -1}; 
		}
		let Smem = Memory.structure[s.id][role];
		if(Smem.lastHandled == -1) {
			return false;
		}
		if(Smem.lastHandled < Game.time - 3) {
			Smem.creep = null;
			Smem.lastHandled = -1;
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
		let Smem = Memory.structure[s.id][role];
		Smem.creep = creep.id;
		Smem.lastHandled = Game.time;
	}
};
