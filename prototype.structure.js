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
			return false;
		}
		let Smem = Memory.structure[s.id];
		if(Smem[role] == undefined) {
			return false;
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

                if(Memory.structure[s.id] == undefined) {
                        Memory.structure[s.id] = {};
                }

                let Smem = Memory.structure[s.id];

                if(Smem[role] == undefined) {

                        Smem[role] = {creep: null, lastHandled: -1};
                }
		if(s.isBeingHandled(creep) == false) {
			Smem = Memory.structure[s.id][role];
			Smem.creep = creep.id;
			Smem.lastHandled = Game.time;
			var text = String.fromCodePoint(0xD83D) + " " + creep.name;
			new RoomVisual(s.room.name).text(text, s.pos.x, s.pos.y, {color: 'white', size: 1, align: 'center'});
		}
	};
        Structure.prototype.onRampart =
        function() {
		var thisStructure = this;
		var finder = thisStructure.pos.lookFor(LOOK_STRUCTURES);
		if(finder.length == 0) {
			return false;
		}
		for(let structureI of finder){
			var structure = structureI;
			if(structure == undefined) {
				continue;
			}
			if(structure.structureType == STRUCTURE_RAMPART) {
				return true;
			}
		}
		return false;
	};
};
