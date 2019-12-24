const color_key = {
	' ' : 'black',
	b : 'blue',
	B : 'black',
	y : 'yellow',
	r : 'red',
	p : 'purple',
	g: 'green',
	R : 'brown'
}

const art = {
	player: [
		[
		' O ',
		'-|-',
		'/ \\'
		], [
		' B ', 
		'BBB', 
		'BBB'
		]
	],
	bob: [
		[
		' . ',
		'.O.',
		' M '
		], [
		' g ', 
		'BBB', 
		' B '
		]
	],
	puddle: [
		[
		'   ~~~ ',
		' ~~~~~~',
		'~~~~~~ ',
		'~~~~~~~',
		'  ~~~~'
		], [
		'   bbb ',
		' bbbbbb',
		'bbbbbb ',
		'bbbbbbb',
		'  bbbbb'
		]
	],
	grass: [
		[
		'\''
		], [
		'g'
		]
	],
	grass2: [
		[
		'\'\''
		], [
		'gg'
		]
	],
	grass3: [
		[
		'"""'
		], [
		'ggg'
		]
	],
	sand: [
		[
		'.'
		], [
		'y'
		]
	],	
	big_puddle: [
		[
		'    ~~~~~      ',
		' ~~~~~~~~~~    ',
		'~~~~~~~~~~~~~~~',
		'~~~~~~~~~~~~~~ ',
		'~~~~~~~~~~~~~~ ',
		' ~~~~~~~~~~~   ',
		'  ~~~~~~~~~~~  ',
		' ~~~~~~~~      ',
		'   ~~~         '
		], [
		'    bbbbb      ',
		' bbbbbbbbbb    ',
		'bbbbbbbbbbbbbbb',
		'bbbbbbbbbbbbbb ',
		'bbbbbbbbbbbbbb ',
		' bbbbbbbbbbb   ',
		'  bbbbbbbbbbb  ',
		' bbbbbbbb      ',
		'   bbb         '
		]
	],
	tree: [
		[
		'  ouo=uuuo  ',
		'~u=o~ouu~~=o',
		'u~~~u=uu~uoo',
		'uuo~~ou=o~uo',
		'  ou ||ouu  ',
		'     ||     ',
		'     ||     ',
		'    .||.    ',
		'   ``````   '
		], [
		'  gggggggg  ',
		'ggRgggggggRg',
		'gggggRgggggg',
		'gggggggRgggg',
		'  gg RRggg  ',
		'     RR     ',
		'     RR     ',
		'    gRRg    ',
		'   RRRRRR   '
		]
	],
	cactus: [
		[
		'  # #',
		'# # #',
		'# #* ',
		'*##  ',
		'  #: ',
		' :#  '
		], [
		'ggggg',
		'ggggg',
		'ggggg',
		'ggggg',
		'ggggg',
		'ggggg'
		]
	],
	small_cactus: [
		[
		'.',
		'#',
		'#'
		], [
		'g',
		'g',
		'g'
		]
	]		
}

const heads = ['O', '0', 'o', '8', '*', 'G', '?'];

