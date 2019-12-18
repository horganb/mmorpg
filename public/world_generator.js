module.exports = {
	generateWorld: generateWorld,
	randomNum: randomNum
};

const global_range = 1000;

const worldGenList = {
	'bob': {locs: ['desert', 'grasslands'], density: 6},
	'puddle': {locs: ['grasslands'], density: 2},
	'big_puddle': {locs: ['grasslands'], density: 1},
	'grass': {locs: ['grasslands'], density: 500},
	'sand': {locs: ['desert'], density: 500},
	'tree': {locs: ['grasslands'], density: 2},
	'grass3': {locs: ['desert'], density: 15},
	'cactus': {locs: ['desert'], density: 5},
	'small_cactus': {locs: ['desert'], density: 8}
}

const biomes = {
	'grasslands': '#b3ffb3',
	'desert': '#ffa64d'
}

function generateWorld(nextId, entities, land) {
	generateLand(land);
	
	land.forEach(function(block) {
		for (const item in worldGenList) {
			var vals = worldGenList[item];
			if (vals.locs.includes(block.name)) {
				//var num = randomNum(vals.min, vals.max);
				var num = vals.density * (block.width * block.height) / 1000000;
				for (var i = 0; i < num; i++) {
					var x = randomNum(block.x1, block.x1 + block.width);
					var y = randomNum(block.y1, block.y1 + block.height);
					entities[nextId] = {
						name: item,
						x: x,
						y: y
					}
					nextId++;
				}				
			}
		}
	});

	return nextId;
}

function generateLand(land) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var x = -2000 + 1000 * i;
			var y = -2000 + 1000 * j;
			var width = 1000;
			var height = 1000;
			var chosen = randomNum(0, Object.keys(biomes).length - 1);
			var name;
			var color;
			name = Object.keys(biomes)[chosen];
			color = biomes[name];
			land.push({
				name: name,
				color: color,
				x1: x,
				y1: y,
				width: width,
				height: height
			});
		}
	}
}

function randomNum(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}



